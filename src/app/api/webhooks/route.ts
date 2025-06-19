import { User } from "@/db/schema";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("here");
  try {
    const evt = await verifyWebhook(req);
    if (evt.type === "user.created") {
      const { id, email_addresses } = evt.data;
      const user: User = {
        id,
        email: email_addresses[0].email_address,
        username: email_addresses[0].email_address.split("@")[0],
      };

      const result = await createUser(user);
      if (!result.success) {
        console.error("Failed to create user:", result.error);
        return new Response(result.error, { status: 500 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
