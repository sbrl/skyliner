fn fun_test(value: i32, f: &dyn Fn(i32) -> i32) {
    println!("{}", f(value));
    value
}
