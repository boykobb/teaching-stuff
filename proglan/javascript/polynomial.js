// Итеративно по схемата на Хорнър.
var polynomial1 = function(cs,x) {
  var v = 0
  for (var c of cs) v = v*x+c
  return v
}

// Рекурсивно по схемата на Хорнър.
var polynomial2 = function(cs,x) {
  var n = cs.length-1
  return n > 0 ? polynomial2(cs.slice(0,n),x)*x+cs[n] : cs[0]
}

// Неявно обхождане с прилагане на схемата на Хорнър.
var polynomial3 = function(cs,x) {
  return cs.reduce((v,c) => v*x+c)
}
