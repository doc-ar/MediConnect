document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Password reset successful!");
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert("An error occurred. Please try again.");
  }
});
