import * as bcrypt from 'bcrypt';
class Helper {
  async hashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

const helper = new Helper();
export default helper;
