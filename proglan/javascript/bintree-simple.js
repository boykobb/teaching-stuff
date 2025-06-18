// Вмъкване на стойност в двоично подреждащо дърво.
var bstInsert = function(tr,x) {
  var root = tr
  while (tr.value != undefined)
    tr = x <= tr.value ? tr.left : tr.right
  ;[tr.value,tr.left,tr.right] = [x,{},{}]
  return root
}

// Обхождане на двоично дърво в инфиксен ред.
// За всеки възел съпрограмно се излъчва стойността му.
var btInorder = function*(tr) {
  if (tr.value != undefined) {
    yield* btInorder(tr.left)
    yield tr.value
    yield* btInorder(tr.right)
  }
}

var bstree = [5,3,8,6,4,9,1,7,2].reduce(bstInsert,{})

// var bstree = [6,2,1,4,3,5,13,8,14,12,7,9,11,15,10].reduce(bstInsert,{})

for (var x of btInorder(bstree))
  console.log(x)
