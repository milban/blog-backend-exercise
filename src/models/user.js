import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

UserSchema.method('serialize', function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
});

UserSchema.method('generateToken', function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
  return token;
});

UserSchema.static('findByUsername', function (username) {
  return this.findOne({ username });
});

const User = mongoose.model('user', UserSchema);
export default User;
