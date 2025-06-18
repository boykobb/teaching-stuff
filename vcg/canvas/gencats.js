// Процедури за построяване на каталанови обекти.
// Получаването става чрез преобразуване от два основни вида обекта – низ от
// скоби и двоично дърво.  Двоично дърво също се получава от низ от скоби.
// Налице са следните преобразуващи процедури:
//   • от низ от скоби – двоично дърво,
//   • от низ от скоби – „купчина трупи“,
//   • от низ от скоби – стекова пермутация,
//   • от двоично дърво – низ от 0 и 1,
//   • от двоично дърво – низ-израз със събирания и скоби,
//   • от двоично дърво – „разрязване на стълба“,
//   • от двоично дърво – триангулация.
// -----------------------------------------------------------------------------


// Низ от двойки скоби —> двоично дърво
function parens_to_btree(s) {
  weights = function(tree) {
    return tree.weight = 1 + ('left' in tree ? weights(tree.left) : 0)
                           + ('right' in tree ? weights(tree.right) : 0)
  }
  var c,n,p,i
  n = {}
  p = [n]
  c = '('
  for (i=1; i<s.length; ++i) {
    if (s[i]==')') {
      if (c==')')
        do n = p.pop(); while ('right' in n)
    } else {
      if (c=='(') {n.left = {}; p.push(n); n = n.left}
      else if (c==')') {n.right = {}; p.push(n); n = n.right}
    }
    c = s[i]
  }
  weights(p[0])
  return p[0]
}

// Низ от двойки скоби —> масив от координатите на трупи (монети).
// Координатите са целочислени, в скосена координатна система
function parens_to_logs(s) {
  var i,j,x,y,logs
  for (logs=[],x=0,y=-1,i=0; i<s.length; ++i)
    if (s[i]=='(')
      for (++y,j=0; y-j>=0; ++j)
        logs.push([x+j,y-j])
    else ++x, --y
  return logs
}

// Низ от двойки скоби —> масив – стекова пермутация на последователни числа 1,2,…
function parens_to_perm(s) {
  var i,k,perm,stk
  for (perm=[],stk=[],i=k=0; i<s.length; ++i)
    if (s[i]=='(') stk.push(++k)
    else           perm.push(stk.pop())
  return perm
}

// Двоично дърво —> запис на суфиксния обход на съответното строго ДД:
// низ от 1 за вътрешните върхове и 0 за листата (добавените върхове)
function btree_to_001(tree) {
  return ('left' in tree ? btree_to_001(tree.left) : '0')
       + ('right' in tree ? btree_to_001(tree.right) : '0')
       + '1'
}

// Двоично дърво —> израз-низ със събирания (и скоби)
function btree_to_expr(tree) {
  return ('left' in tree ? ('(' + btree_to_expr(tree.left) + ')') : 'A') + '+'
       + ('right' in tree ? ('(' + btree_to_expr(tree.right) + ')') : 'A')
}

// Двоично дърво —> масив от координати на правоъгълници, които образуват нарязването на стълба
// (всеки правоъгълник се представя с две диагонални точки, координатите са цели числа ≥0, като
// 0,0 е долният ляв ъгъл)
function btree_to_staircase(tree,xoff,yoff) {
  var rects = []
  if (typeof xoff === 'undefined') xoff = yoff = 0
  var n = tree.weight
  var nleft = 'left' in tree ? tree.left.weight : 0
  if (nleft > 0) rects = rects.concat(btree_to_staircase(tree.left,xoff,yoff+n-nleft))
  rects.push([xoff,yoff,xoff+nleft+1,yoff+n-nleft])
  if (n-nleft > 1) rects = rects.concat(btree_to_staircase(tree.right,xoff+nleft+1,yoff))
  return rects
}

// Двоично дърво —> масив от диагонали в триангулация на n-ъгълник.  Всеки диагонал се задава
// като двойка номера на върхове, а тези номера са числата от 0 до n-1.  По ред на номерата
// върховете са последователни върху контура на n-ъгълника
function btree_to_triang(tree,vertices) {
  var diags = []
  var n = tree.weight
  if (n > 1) {
    if (typeof vertices === 'undefined') {
      vertices=[]
      for (var i=0; i<n+2; ++i) vertices.push(i)
    }
    var nleft = 'left' in tree ? tree.left.weight : 0
    if (n > nleft+1) diags.push([vertices[0],vertices[nleft+2]])
    if (nleft > 0) {
      diags.push([vertices[1],vertices[nleft+2]])
      if (nleft > 1)
        diags = diags.concat(btree_to_triang(tree.left,[vertices[nleft+2]].concat(vertices.slice(1,nleft+2))))
    }
    if (n > nleft+2)
      diags = diags.concat(btree_to_triang(tree.right,[vertices[0]].concat(vertices.slice(nleft+2))))
  }
  return diags
}
