import { Router } from "express";
import {
  generateUserAccessToken,
  generateUserRefreshToken,
  getTokenByUserId,
  loginUser,
  signupUser,
  deleteTokenByUserId,
  addTokenToUser,
  getUserById,
} from "../../database/functions/user";
import { checkAccess } from "../../middleware/auth";
import { verifyRefreshToken } from "../../utils/crypto";
import { User } from "../../database/models/user";

const router = Router();

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const payload = refreshToken
      ? await verifyRefreshToken(refreshToken)
      : null;

    const userID = (payload as User)?.id;

    const deleted = await deleteTokenByUserId(userID);

    return res.status(200).json({
      message: "User logged out successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      data: null,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Missing required fields",
        data: null,
      });
    }

    const user = await signupUser({
      email,
      password,
      firstName,
      lastName,
      role: "user",
    });

    if (!user) {
      return res.status(500).json({
        message: "There was a problem creating the user",
        data: null,
      });
    }

    const accessToken = await generateUserAccessToken(user);
    const refreshToken = await generateUserRefreshToken(user);

    addTokenToUser(user.id, refreshToken);

    return res.status(200).json({
      message: "User created successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        data: null,
      });
    }

    const user = await loginUser(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        data: null,
      });
    }

    const accessToken = await generateUserAccessToken(user);
    const refreshToken = await generateUserRefreshToken(user);

    addTokenToUser(user.id, refreshToken);

    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      data: null,
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Missing required fields",
        data: null,
      });
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return res.status(401).json({
        message: "Invalid token",
        data: null,
      });
    }

    const userID = (payload as User).id;

    const token = await getTokenByUserId(userID);

    if (!token) {
      return res.status(401).json({
        message: "Invalid token",
        data: null,
      });
    }

    const accessToken = await generateUserAccessToken(token.user);

    return res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      data: null,
    });
  }
});

router.get("/me", checkAccess, async (req, res) => {
  try {
    const payload = (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload;

    if (!payload || !("id" in (payload as Record<string, unknown>))) {
      return res.status(200).json({
        message: "User could not be retrieved",
        data: null,
      });
    }

    const user = await getUserById((payload as User).id);

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      data: null,
    });
  }
});

export default router;
