import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { title, description, dueDate, priority, category } = await request.json();

    if (!dueDate) {
      return NextResponse.json({ error: "Due date required" }, { status: 400 });
    }

    // Build Google Calendar pre-filled URL
    const dateStr = dueDate.replace(/-/g, "");
    const nextDay = new Date(dueDate + "T00:00:00");
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = nextDay.toISOString().split("T")[0].replace(/-/g, "");

    const details = [
      description || "",
      `Priority: ${priority}`,
      category ? `Category: ${category}` : "",
      "Created from Galaxy Todo ✦",
    ].filter(Boolean).join("\n");

    const calendarUrl = new URL("https://calendar.google.com/calendar/render");
    calendarUrl.searchParams.set("action", "TEMPLATE");
    calendarUrl.searchParams.set("text", title);
    calendarUrl.searchParams.set("dates", `${dateStr}/${endStr}`);
    calendarUrl.searchParams.set("details", details);

    return NextResponse.json({
      calendarUrl: calendarUrl.toString(),
      eventId: `galaxy-${Date.now()}`,
    });
  } catch (err) {
    console.error("Calendar API error:", err);
    return NextResponse.json({ error: "Failed to create calendar link" }, { status: 500 });
  }
}
