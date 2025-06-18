// Процедури за рисуване в канава.  Навсякъде ctx е т.нар. „контекст“ на канавата.
// Налице са процедури за рисуване на следните обекти:
//   • каталанова фигура (обща процедура, чрез която се повикват тези за конкретни фигури),
//   • „планински хребет“,
//   • поддиагонален маршрут,
//   • „купчина трупи“,
//   • „тухлена стена“,
//   • огърлица,
//   • нарязване на стълба,
//   • триангулация,
//   • двоично дърво.
// Следните процедури са помощни:
//   • установяване на координатна система в канава,
//   • избор (изменяне) на размерите на канава,
//   • построяване на окръжност или кръг,
//   • рисуване на текст (може да се използва за показване на низ от скоби, на
//     аритметичен израз, на пермутация и др.).
// -----------------------------------------------------------------------------


// Обръща нагоре посоката на ординатата.
// Унищожава действието на евентуални предишни координатни трансформации
function set_cs(ctx) {
  ctx.setTransform(1,0,0,1,0,0)
  ctx.scale(1,-1); ctx.translate(0,-ctx.canvas.height)
}

// Задава нови размери на канава
function set_viewport(ctx,w,h) {
  ctx.canvas.width = w
  ctx.canvas.height = h
  set_cs(ctx)
}

function circle(ctx,x,y,r) {ctx.arc(x,y,r,0,2*Math.PI)}

// Рисува текстов низ s около хоризонтала y в контекста ctx.
// Използва се шрифт monospaced и той се прави толкова голям,
// че низът да запълва ширината на канавата.
function text(ctx,s,y) {
  set_cs(ctx)
  ctx.translate(0,y); ctx.scale(1,-1)
  var fs = 10
  ctx.font = ''+fs+'px monospace'
  fs *= (ctx.canvas.width/ctx.measureText(s).width)
  ctx.font = ''+fs+'px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(s,ctx.canvas.width/2,0)
  ctx.scale(1,-1); ctx.translate(0,-y)
}

// Рисува коя да е каталанова фигура по параметри n и k.
// n може да е низ от скоби, дърво, низ от 0 и 1 (от суфиксно обхождане) или цяло число.
// В последния случай присъства и цялото число k:
// задава се фигура от ред n и пореден номер k в редицата от скоби от ред n.
// Функцията cat трябва да дава обект с членове:
//   draw – функция с параметър контекст, която я рисува;
//   width и height – размери в произволно избрани единици;
//       предполага се, че фигурата попада в правоъгълника (0,0,width,height)
function draw_any(ctx,cat,n,k) {
  set_cs(ctx)
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
  var o = cat(n,k)
  var scaling = Math.min(ctx.canvas.width/o.width,ctx.canvas.height/o.height)
  ctx.scale(scaling,scaling)
  o.draw(ctx)
}

// Функциите по-надолу рисуват конкретни каталанови фигури

// „Планински хребет“ по низ от скоби или по брой и пореден номер в редицата от скоби
function ridge(n,k) {
  var s
  if (typeof k !== 'undefined') {s = genparens(n)[k-1]; n *= 2}
  else                          {s = n; n = s.length}
  var postns = [[0,0]]
  var j = 0
  for (var i in s)
    postns.push([parseInt(i)+1, s[i]==='(' ? ++j : --j])
  return {width: .5+n
         ,height: .5+postns.map(function(p) {return p[1]})
                            .reduce(function(p,q) {return Math.max(p,q)})
         ,draw: function(ctx) {
                  ctx.strokeStyle = '#000'
                  ctx.lineWidth = .01*n
                  ctx.lineCap = 'round'
                  ctx.lineJoin = 'round'
                  ctx.beginPath()
                  ctx.moveTo(.2+postns[0][0],.2+postns[0][1])
                  for (var i=1; i<postns.length; ++i)
                    ctx.lineTo(.2+postns[i][0],.2+postns[i][1])
                  ctx.stroke()
                  for (var i in postns) {
                      ctx.beginPath()
                      circle(ctx,.2+postns[i][0],.2+postns[i][1],.01*n)
                      ctx.fill()
                  }
                }
         }
}

// Поддиагонален маршрут по низ от скоби или по брой и пореден номер в редицата от скоби
function walk(n,k) {
  var s
  if (typeof k !== 'undefined') s = genparens(n)[k-1]
  else                          {s = n; n = s.length/2}
  var postns = [[0,0]]
  var i = 0, j = 0
  for (var k in s)
    postns.push(s[k]==='(' ? [++i,j] : [i,++j])
  return {width: .5+n
         ,height: .5+n
         ,draw: function(ctx) {
                  ctx.lineCap = 'round'
                  ctx.lineJoin = 'round'
                  ctx.fillStyle = '#cdf'                         // заградена площ
                  ctx.beginPath()
                  for (i in postns) {
                    if (postns[i][1] > 0) {
                      if (postns[i-1][1] == 0)
                        if (postns[i][0] < n)
                          ctx.moveTo(.2+postns[i-1][0],.2+postns[i-1][1])
                        else break
                      ctx.lineTo(.2+postns[i][0],.2+postns[i][1])
                    }
                    if (postns[i][0] == n) break
                  }
                  ctx.lineTo(.2+n,.2+0)
                  ctx.fill()
                  ctx.strokeStyle = '#f88'                       // диагонал
                  ctx.lineWidth = .005*n
                  ctx.beginPath()
                  ctx.moveTo(.2+0,.2+0)
                  ctx.lineTo(.2+n,.2+n)
                  ctx.stroke()
                  ctx.strokeStyle = '#ccc'                       // мрежа
                  ctx.lineWidth = .005*n
                  ctx.beginPath()
                  for (i=0; i<=n; ++i) {
                    ctx.moveTo(.2+0,.2+i)
                    ctx.lineTo(.2+n,.2+i)
                  }
                  for (i=0; i<=n; ++i) {
                    ctx.moveTo(.2+i,.2+0)
                    ctx.lineTo(.2+i,.2+n)
                  }
                  ctx.stroke()
                  ctx.strokeStyle = '#00f'                       // маршрут
                  ctx.lineWidth = .01*n
                  ctx.beginPath()
                  ctx.moveTo(.2+postns[0][0],.2+postns[0][1])
                  for (var i=1; i<postns.length; ++i)
                    ctx.lineTo(.2+postns[i][0],.2+postns[i][1])
                  ctx.stroke()
                }
         }
}

// Купчина от трупи по низ от скоби или по брой и пореден номер в редицата от скоби
function logs(n,k) {
  var s
  if (typeof k !== 'undefined') s = genparens(n)[k-1]
  else                          {s = n; n = s.length/2}
  var postns = parens_to_logs(s)
  return {width: .05+n
         ,height: .05+Math.sqrt(3)/2*postns.map(function(p) {return p[1]})
                                           .reduce(function(p,q) {return Math.max(p,q)})
         ,draw: function(ctx) {
                  ctx.lineWidth = 0
                  ctx.fillStyle = '#b50'
                  for (var i in postns) {
                    ctx.beginPath()
                    circle(ctx,.5+postns[i][0]+postns[i][1]/2,.5+Math.sqrt(3)/2*postns[i][1],.5)
                    ctx.fill()
                  }
                }
         }
}

// Тухлена стена по низ от скоби или по брой и пореден номер в редицата от скоби.
// За места на тухлите се използват тези на трупите
function bricks(n,k) {
  var s
  if (typeof k !== 'undefined') s = genparens(n)[k-1]
  else                          {s = n; n = s.length/2}
  var postns = parens_to_logs(s)
  return {width: .15+n
         ,height: .15+.5*postns.map(function(p) {return p[1]})
                               .reduce(function(p,q) {return Math.max(p,q)})
         ,draw: function(ctx) {
                  ctx.strokeStyle = '#000'
                  ctx.lineWidth = .008*n
                  ctx.lineCap = 'round'
                  ctx.lineJoin = 'round'
                  ctx.beginPath()
                  for (var i in postns)
                    ctx.strokeRect(.6+postns[i][0]-.5+.5*postns[i][1],.35+.5*postns[i][1]-.25,1,.5)
                }
         }
}

// Огърлица по ДД, по низ от скоби, по низ от 0 и 1 или по брой и пореден номер
// в редицата от скоби
function necklace(n,k) {
  if (typeof k !== 'undefined') n = genparens(n)[k-1]
  if (typeof n === 'string' && n[0] === '(')
    n = parens_to_btree(n)
  if (typeof n === 'object') n = btree_to_001(n)
  return {width: 2.27, height: 2.27,
          draw: function(ctx) {
                  ctx.strokeStyle = '#000'
                  ctx.lineWidth = .04
                  ctx.beginPath()
                  circle(ctx,1.11,1.11,1)
                  ctx.stroke()
                  var a = 2*Math.PI/n.length, b = Math.PI/2-((n.length+1)%2)*a/2
                  ctx.lineWidth = .024
                  for (var i in n) {
                    var c = Math.cos(b+i*a), s = Math.sin(b+i*a)
                    if (n[i] === '1') {
                      ctx.beginPath()
                      ctx.fillStyle = '#000'
                      circle(ctx,1.11+c,1.11+s,.11)
                      ctx.fill()
                    } else {
                      ctx.beginPath()
                      ctx.fillStyle = '#fff'
                      circle(ctx,1.11+c,1.11+s,.12)
                      ctx.fill()
                      ctx.beginPath()
                      ctx.strokeStyle = '#000'
                      circle(ctx,1.11+c,1.11+s,.11)
                      ctx.stroke()
                    }
                  }
                }
         }
}

// Разрязване на стълба по ДД, по низ от скоби или по брой и пореден номер в редицата от скоби
function staircase(n,k) {
  if (typeof k !== 'undefined') n = genparens(n)[k-1]
  if (typeof n === 'string') n = parens_to_btree(n)
  var rects = btree_to_staircase(n)
  n = rects.length
  return {width: .15+n, height: .15+n,
          draw: function(ctx) {
                  ctx.strokeStyle = '#000'
                  ctx.lineWidth = .01*n
                  ctx.lineCap = 'round'
                  ctx.lineJoin = 'round'
                  ctx.beginPath()
                  for (var i in rects)
                    ctx.strokeRect(.1+rects[i][0],.1+rects[i][1],rects[i][2]-rects[i][0],rects[i][3]-rects[i][1])
                }
         }
}

// Триангулация по ДД, по низ от скоби или по брой и пореден номер в редицата от скоби
function triangulation(n,k) {
  if (typeof k !== 'undefined') n = genparens(n)[k-1]
  if (typeof n === 'string') n = parens_to_btree(n)
  var lines = btree_to_triang(n)
  n = 3+lines.length
  for (var i=0; i<n; ++i)
    lines.push([i,(i+1)%n])
  var a = 2*Math.PI/n, b = Math.PI/2-((n+1)%2)*a/2
  lines = lines.map(function(p) {return p.map(function(i) {return [1+Math.cos(b+i*a),1+Math.sin(b+i*a)]})})
  return {width: 2.05, height: 2.05,
          draw: function(ctx) {
                  ctx.strokeStyle = '#000'
                  ctx.lineWidth = .013
                  ctx.lineCap = 'round'
                  ctx.lineJoin = 'round'
                  ctx.beginPath()
                  for (var i in lines) {
                    ctx.moveTo(lines[i][0][0],lines[i][0][1])
                    ctx.lineTo(lines[i][1][0],lines[i][1][1])
                  }
                  ctx.stroke()
                }
         }
}

// Двоично дърво непосредствено зададено, по низ от скоби или по брой и пореден номер в редицата от скоби
function binary_tree(n,k) {
  if (typeof k !== 'undefined') n = genparens(n)[k-1]
  if (typeof n === 'string') n = parens_to_btree(n)
  var h = 0
  var nodes = [], edges = []
  collect_edges = function(tree,px,py,offx) {
    var x,y
    if (typeof offx === 'undefined') {offx = 0; py = -1}
    x = offx + ('left' in tree ? tree.left.weight : 0)
    y = py+1
    h = Math.max(h,y)
    nodes.push([x,y])
    if (typeof px !== 'undefined') edges.push([px,py,x,y])
    if ('left' in tree) collect_edges(tree.left,x,y,offx)
    if ('right' in tree) collect_edges(tree.right,x,y,x+1)
  }
  collect_edges(n)
  return {width: .5+n.weight-1, height: .5+h,
          draw: function(ctx) {
                  ctx.strokeStyle = '#000'
                  ctx.lineWidth = .007*n.weight
                  ctx.lineCap = 'round'
                  ctx.lineJoin = 'round'
                  ctx.beginPath()
                  for (var i in edges) {
                    ctx.moveTo(.2+edges[i][0],.2+h-edges[i][1])
                    ctx.lineTo(.2+edges[i][2],.2+h-edges[i][3])
                  }
                  ctx.stroke()
                  for (var i in nodes) {
                    ctx.beginPath()
                    circle(ctx,.2+nodes[i][0],.2+h-nodes[i][1],1.3*ctx.lineWidth)
                    ctx.fill()
                  }
                }
         }
}
