import { User, IUser } from './user.model';
import { hashPassword } from '../../utils/password';
import { getPaginationOptions, getPaginationResult, PaginationOptions } from '../../utils/pagination';
import { CustomError } from '../../middleware/errorHandler';

export class UserService {
  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    status?: string;
  }): Promise<IUser> {
    const { email, password, firstName, lastName, role, status } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('User with this email already exists', 400);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = new User({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      status: status || 'ACTIVE',
    });

    return await user.save();
  }

  async getUsers(query: any): Promise<{ users: IUser[]; pagination: any }> {
    const options = getPaginationOptions(query);
    const { page, limit, sortBy, sortOrder } = options;

    // Build filter
    const filter: any = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('meta.class', 'name section')
        .populate('meta.subjects', 'name code')
        .lean(),
      User.countDocuments(filter),
    ]);

    return getPaginationResult(users, total, options);
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id)
      .populate('meta.class', 'name section')
      .populate('meta.subjects', 'name code')
      .populate('meta.parentOf', 'firstName lastName email')
      .populate('meta.studentOf', 'firstName lastName email');

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Check if email is being updated and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        throw new CustomError('User with this email already exists', 400);
      }
    }

    Object.assign(user, updateData);
    return await user.save();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    await User.findByIdAndDelete(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+passwordHash');
  }

  async updateUserPassword(id: string, newPassword: string): Promise<void> {
    const passwordHash = await hashPassword(newPassword);
    await User.findByIdAndUpdate(id, { passwordHash });
  }

  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { lastLogin: new Date() });
  }
}

