// List of admin email addresses (can be updated in environment variables)
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@example.com,admin@ecoquest.com")
  .split(",")
  .map((e) => e.trim())

export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const userSession = localStorage.getItem("user_session")
    if (!userSession) return false

    const session = JSON.parse(userSession)

    // Check if user email is in admin list
    return ADMIN_EMAILS.includes(session.email || "")
  } catch (error) {
    console.error("[v0] Error checking admin status:", error)
    return false
  }
}
