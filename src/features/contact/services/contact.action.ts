"use server";

export async function submitContactMessage(payload: { title: string; message: string }) {
  try {
    const response = await fetch(`http://87.107.2.216:2007/api/contact-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Error sending message!");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Contact API Error:", error);
    return { success: false, error: "Error connecting Server!" };
  }
}