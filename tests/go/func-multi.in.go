func main() {
    vAdd, vSub := addSub(35, 25)
    fmt.Printf("35 + 25 = %d\n", vAdd)    // prints "35 + 25 = 60"
    fmt.Printf("35 - 25 = %d\n", vSub)    // prints "35 - 25 = 10"
}

func addSub(x, y int) {        // multiple return values (int, int)
   fmt.Printf("35 - 25 = %d\n", vSub)    // prints "35 - 25 = 10"
}

func main_another() {
    fmt.Println(divby10(100))
}
 
func divby10(num int) (res int) {
    res = num/10
    return res
}
