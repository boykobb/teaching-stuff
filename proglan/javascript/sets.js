// Плосък масив, ако аргументът е масив, иначе самия аргумент.
var flatten = function(xs) {
  if (!Array.isArray(xs) || xs.length == 0) return xs
  var x = xs[0]
  var a = Array.isArray(x) ? flatten(x) : [x]
  return a.concat(flatten(xs.slice(1)))
}

// За масиви и низове – множество от членовете без повтаряне.
var setof = function(xs) {
  if (xs.length == 0) return xs
  var x = xs[0], as = xs.slice(1), f = (a) => a != x
  if (Array.isArray(xs)) {
    as = setof(as.filter(f))
    as.unshift(x)
  } else {
    as = ''.concat.apply(x,setof([].filter.call(as,f)))
  }
  return as
}
