(module ;; This is a comment
   (global $g (import "js" "global") (mut i32)) ;; This is a comment
   (func (export "getGlobal") (result i32) ;; This is a comment
        (global.get $g))
)
