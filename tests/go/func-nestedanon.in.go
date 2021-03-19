func main() {
     
    getMod := func(a, b int) (int) {         // declare it
        return a%b
    }
     
    fmt.Println(getMod(12, 5))               // prints 2
                                             // call by its name
}
