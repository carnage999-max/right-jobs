import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function POST(req: Request) {
  if (process.env.STRIPE_ENABLED !== "true") {
    return NextResponse.json({ ok: false, message: "Payments are currently disabled." }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { priceId } = await req.json();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email!,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing?canceled=true`,
      metadata: { userId: session.user.id! },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ ok: false, message: "Payment setup failed." }, { status: 500 });
  }
}
