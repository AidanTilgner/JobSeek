import { dataSource } from "..";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "../../utils/crypto";
import { User } from "../models/user";
import { Token } from "../models/token";

export async function signupUser({
  email,
  password,
  firstName,
  lastName,
  role,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) {
  try {
    const user = new User();
    user.email = email;
    user.password = hashPassword(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;
    await dataSource.manager.save(user);

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateUserAccessToken(user: User) {
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return accessToken;
}

export async function generateUserRefreshToken(user: User) {
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return refreshToken;
}

export async function getUserById(id: number) {
  try {
    const user = await dataSource.manager.findOne(User, {
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getTokenByUserId = async (userId: number) => {
  try {
    const token = await dataSource.manager.findOne(Token, {
      where: {
        user: {
          id: userId,
        },
      },
    });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addTokenToUser = async (userId: number, refreshToken: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return null;
    }

    const token = new Token();
    token.user = user;
    token.refreshToken = refreshToken;
    await dataSource.manager.save(token);
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTokenByUserId = async (userId: number) => {
  try {
    const token = await getTokenByUserId(userId);
    if (!token) {
      return null;
    }
    await dataSource.manager.delete(Token, token);
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};
