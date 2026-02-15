import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const generateVerificationToken = async (email: string, type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "PASSWORD_CHANGE") => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  // Delete existing tokens of same type for this email
  await prisma.verificationToken.deleteMany({
    where: { email, type }
  });

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
      type
    }
  });

  return verificationToken;
};

export const generateAdminOtp = async (email: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 600 * 1000); // 10 minutes from now

  const adminOtp = await prisma.adminOtp.upsert({
    where: { email },
    update: {
      otp,
      expiresAt,
    },
    create: {
      email,
      otp,
      expiresAt,
    }
  });

  return adminOtp;
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });
    return verificationToken;
  } catch {
    return null;
  }
};
