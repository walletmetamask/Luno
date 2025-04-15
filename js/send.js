document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Get token from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const tokenParam = urlParams.get("token")

  // Update UI with token name
  const tokenSelect = document.getElementById("tokenSelect")
  const tokenSelectMobile = document.getElementById("tokenSelectMobile")

  if (tokenParam) {
    if (tokenSelect) tokenSelect.value = tokenParam
    if (tokenSelectMobile) tokenSelectMobile.value = tokenParam
  }

  // Send options tab switching
  const sendOptions = document.querySelectorAll(".send-option")
  const sendForms = document.querySelectorAll(".send-form")

  sendOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove active class from all options and forms
      sendOptions.forEach((opt) => opt.classList.remove("active"))
      sendForms.forEach((form) => form.classList.remove("active"))

      // Add active class to clicked option
      this.classList.add("active")

      // Show corresponding form
      const formId = this.getAttribute("data-form")
      document.getElementById(formId).classList.add("active")
    })
  })

  // Continue button handlers
  const continueBtn = document.getElementById("continueBtn")
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      const tokenType = document.getElementById("tokenSelect").value
      const recipientAddress = document.getElementById("recipientAddress").value
      const amount = document.getElementById("amount").value
      const note = document.getElementById("note").value
      const errorElement = document.getElementById("sendError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate inputs
      if (!recipientAddress) {
        errorElement.textContent = "Please enter a recipient address"
        return
      }

      if (!amount || Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Please enter a valid amount"
        return
      }

      // Make API request to send funds
      fetch("/api/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientAddress,
          amount: Number.parseFloat(amount),
          tokenType,
          note,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Show transaction receipt
            window.location.href = `transactions.html?txId=${data.transactionId}`
          } else {
            errorElement.textContent = data.message || "Failed to send funds"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Send error:", error)
        })
    })
  }

  // Mobile continue button
  const continueBtnMobile = document.getElementById("continueBtnMobile")
  if (continueBtnMobile) {
    continueBtnMobile.addEventListener("click", () => {
      const tokenType = document.getElementById("tokenSelectMobile").value
      const mobileNumber = document.getElementById("mobileNumber").value
      const amount = document.getElementById("amountMobile").value
      const note = document.getElementById("noteMobile").value
      const errorElement = document.getElementById("sendErrorMobile")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate inputs
      if (!mobileNumber) {
        errorElement.textContent = "Please enter a mobile number"
        return
      }

      if (!amount || Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Please enter a valid amount"
        return
      }

      // Show coming soon message for now
      alert("Mobile sending feature coming soon!")
    })
  }

  // Open camera button
  const openCameraBtn = document.getElementById("openCameraBtn")
  if (openCameraBtn) {
    openCameraBtn.addEventListener("click", () => {
      alert("Camera access feature coming soon!")
    })
  }
})
