// Функция за образуване на редица на Грей от правилните низове от n двойки
// скоби.  Аргументът е n, а резултатът – масив от низове.
// Чрез преобразования от кой да е низ се получават други каталанови обекти.
// -----------------------------------------------------------------------------


function genparens(n) {
  var parenseq=[], parens=[]
  parnk = function(n,k,pos,dir) {
    if (k==0 || k==n)
      parenseq.push(parens.join(''))
    else if (k==1) {
      parens[pos] = '('
      parnk(n,k+1,pos+1,dir)
      parens[pos] = ')'
    } else if (dir) {
      parens[pos] = '('
      parnk(n,k+1,pos+1,!dir)
      parens[pos] = ')'
      parnk(n-1,k-1,pos+1,dir)
    } else {
      parnk(n-1,k-1,pos+1,dir)
      parens[pos] = '('
      parnk(n,k+1,pos+1,!dir)
      parens[pos] = ')'
    }
  }
  var i,j,k,m
  if (n==0) return []
  else if (n==1) return ['()']
  else if (n==2) return ['(())','()()']
  else {
    for (k=n; k>=1; --k) {
      if (k==1) m = parenseq.length
      for (i=0; i<k; ++i) parens[i] = '('
      if (k==1) {
        parens[i++] = ')'
        parens[i++] = '('
        parens[i++] = '('
        parens[i++] = ')'
        parens[i++] = ')'
        while (i<2*n) {
          parens[i++] = '('
          parens[i++] = ')'
        }
      } else if (k<n) {
        parens[i++] = ')'
        parens[i++] = '('
        for (j=k; j>0; --j) parens[i++] = ')'
        while (i<2*n) {
          parens[i++] = '('
          parens[i++] = ')'
        }
      } else {
        while (i<2*n) parens[i++] = ')'
      }
      parnk(n,k,k+1,true)
    }
    for (i=m,j=parenseq.length-1; i<j; ++i,--j) {
      var t = parenseq[i]
      parenseq[i] = parenseq[j]
      parenseq[j] = t
    }
    return parenseq
  }
}
