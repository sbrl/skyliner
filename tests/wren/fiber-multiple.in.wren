var fiber = Fiber.new {
	System.print("This runs in a separate fiber.")
}

var fiber2 = Fiber.new {
	System.print("This runs in another separate fiber.")
}
