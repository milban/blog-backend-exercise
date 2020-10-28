import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.method('setPassword', async function (password) {
  this.hashedPassword = await bcrypt.hash(password, 10);
});

UserSchema.method('checkPassword', async function (password) {
  return await bcrypt.compare(password, this.hashedPassword);
});

UserSchema.static('findByUsername', function (username) {
  return this.findOne({ username });
});

const User = mongoose.model('user', UserSchema);
export default User;
