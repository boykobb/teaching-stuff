var curry = (f) => (x) => (y) => f(x,y)                 // разлагане
var bind1 = (f,x) => (y) => f(x,y)                      // свързване
var bind2 = (f,y) => (x) => f(x,y)                      // свързване
var flip = (f) => (y) => (x) => f(x)(y)                 // комбинаторът C

// Горните не се използват в упражнението.
// Могат да се определят и по-общо – за функции с какъв да е брой аргументи.

var compose = (f) => (g) => (x) => f(g(x))              // композиране (комбинаторът B)

// Упражнение с комбинатора W (replicator).

var diag = (f) => (x) => f(x)(x)                        // диагонал на разложена функция (W)
var add = (x) => (y) => x+y                             // разложено събиране или слепване
var mul = (x) => (y) => x*y                             // разложено умножение
var recip = (x) => 1/x                                  // реципрочно
var radd = (x) => (y) => recip(recip(x)+recip(y))       // разложено реципрочно събиране
var dbl       = diag(add)                               // удвояване на число или низ
var sqr       = diag(mul)                               // квадрат на число
var halve     = diag(radd)                              // разполовяване на число
var twice     = diag(compose)                           // двукратност на действие
var fourtimes = twice(twice)                            // четирикратност (compose(twice)(twice))
console.log(  dbl(7)                     )              // 14
console.log(  dbl('tar')                 )              // 'tartar' (повтаряне)
console.log(  sqr(7)                     )              // 49
console.log(  halve(7)                   )              // 3.5
console.log(  twice(add(5))(7)           )              // 17
console.log(  compose(twice)(add)(5)(7)  )              // 17
console.log(  twice(add(-5))(7)          )              // -3
console.log(  twice(dbl)('Ta')           )              // "TaTaTaTa"
console.log(  fourtimes(add(5))(7)       )              // 27  (= 5+5+5+5+7)
console.log(  fourtimes(dbl)(7)          )              // 112 (= 2×2×2×2×7)
