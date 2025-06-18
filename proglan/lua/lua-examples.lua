-- Предикат за разпознаване на низ като число, възможно със знак и с точка
-- в началото, между цифрите или накрая. За примери виж по-надолу map().
function isnum(s)
  return (string.find(s,"^[+-]?%d+%.?%d*$") or string.find(s,"^[+-]?%.%d+$")) and true
         or false
end

-- Итератор на m броя начални стойности от редицата 1,2,…,n,n-1,…,1,2,…
function zigzag(n,m)
  local k = 1
  return function(_,i)    -- _ не се използва; състоянието се представя с k
           if m > 0 then
             if (k > 0 and i == n) or (k < 0 and i == 1) then k = -k end
             i = i+k
             m = m-1
             return i
           end
         end,
         nil,
         0
end

-- Пример за използване на zigzag във for
for i in zigzag(5,30) do io.write(i,' ') end
print('\n')

-- Обхождане на редицата as с прилагане на f към всеки член и натрупване на
-- резултат, започвайки от u. Редицата може да бъде масив или функция-итератор.
function accumulate(f,u,as)
  local r = u
  if type(as) == "function" then
    for x in as() do r = f(r,x) end
  else
    for i = 1, #as do r = f(r,as[i]) end
  end
  return r
end

-- Нататък следват множество примери на прилагане на accumulate – пряко и
-- косвено (чрез функции, определени на свой ред пряко или косвено чрез
-- accumulate).

-- Преобразуване на редица чрез прилагане на f към всеки член (образува се
-- нова редица – масив).
function map(f,as)
  return accumulate(function(r,a) table.insert(r,f(a)) return r end,{},as)
end

-- Примери за преобразуване на масиви и на итерирана редица.
print(table.concat(map(function(x) return 10*x end,{3,5,8}),' '))
print(table.concat(map(tostring,map(isnum,{'+254',' 123','0.','1.0.','7.58','-.12'})),' '))
print(table.concat(map(function(x) return x-6 end,function() return zigzag(11,25) end),' '))
print()

-- Добавяне на съдържанието на редица bs към масив as (as се променя).
function ajoin(as,bs)
  return accumulate(function(r,x) table.insert(r,x) return r end,as,bs)
end

-- Образуване на масив от съдържанията на редиците ass.
function catenate(ass)
  return accumulate(ajoin,{},ass)
end

-- Примери за използване на ajoin и catenate.
print(table.concat(ajoin({3,5,8},{'qwe','rt'}),' '))
print(table.concat(catenate{{10,20,30},{'ab','cde'},{'100',200,300,400}},' '))
print()

-- Образуване на сбор от членовете на редица.
function sum(xs)
  return accumulate(function(a,b) return a+b end,0,xs)
end

-- Примери за сумиране на масив и на итерирана редица.
print(sum{5,2,29,-3,8})
print(sum(function() return zigzag(5,10) end))
print()

-- Пресмятане за стойност x на полином с коефициенти от редицата cs.
function poly(cs,x)
  return accumulate(function(v,c) return v*x+c end,0,cs)
end

-- Пример за пресмятане на полином.
print(poly({2,-5,0,1},3),'\n')

-- Нататък под „дърво“ се разбира таблица с член value – стойност на възела,
-- корен на дървото, и евентуално член children – масив от дървета, наследници
-- на корена.

-- Изброяване на възлите на дърво в ред корен-наследници (префиксен ред).
function preorder(tree)
  local t = {tree.value}
  return tree.children and accumulate(ajoin,t,map(preorder,tree.children)) or t
end

-- Изброяване на възлите на дърво в ред наследници-корен (суфиксен ред).
function postorder(tree)
  local t = tree.children and catenate(map(postorder,tree.children)) or {}
  table.insert(t,tree.value)
  return t
end

-- Изброяване на листата на дърво.
function leaves(tree)
  return tree.children and catenate(map(leaves,tree.children)) or {tree.value}
end

-- Изброяване на възлите на дърво по слоеве: всеки слой образува редица,
-- резултатът е редица от тези редици.
function levels(tree)
  local r = {{tree.value}}
  if tree.children then
    local cs = map(levels,tree.children)
    local n = math.max(unpack(map(function(t) return #t end,cs)))
    for j = 1, n do
      local t = {}
      for i = 1, #cs do
        if cs[i][j] then ajoin(t,cs[i][j]) end
      end
      table.insert(r,t)
    end
  end
  return r
end

-- Примерно дърво.
local tree = {value = 'a',                                               --       _a_
              children = {{value = 'b',                                  --     _/ | \_
                           children = {{value = 'e'},                    --    /   |   \
                                       {value = 'f',                     --   b    c    d
                                        children = {{value = 'j'}}}}},   --  / \       /|\
                          {value = 'c'},                                 -- e   f     g h i
                          {value = 'd',                                  --     |
                           children = {{value = 'g'},                    --     j
                                       {value = 'h'},
                                       {value = 'i'}}}}}

-- Прилагане на четирите вида изброявания към примерното дърво.
print('preorder: ',table.concat(preorder(tree),' '))
print('postorder: ',table.concat(postorder(tree),' '))
print('leaves: ',table.concat(leaves(tree),' '))
print('levels: ',table.concat(map(function(t) return table.concat(t,' ') end,levels(tree)),'; '),'\n')

-- Добавяне на стойност в двоично подреждащо дърво.
-- Двоичното дърво е или празна таблица, или таблица с членове value, left и right,
-- където последните две са двоични дървета.
function bst_insert(t,x)
  local tr = t
  while t.value do
    if x <= t.value then t = t.left else t = t.right end
  end
  t.value, t.left, t.right = x, {}, {}
  return tr
end

-- Обхождане на възлите на двоично дърво в ред ляво-корен-дясно.
-- Всеки посетен възел се печата.
function bst_traverse(t)
  if t.value then
    bst_traverse(t.left)
    io.write(t.value,' ')
    bst_traverse(t.right)
  end
end

-- Пример за построяване на д.п. дърво от членовете на редица, в случая масив.
local bstree = accumulate(bst_insert,{},{5,3,34,2,8,1,13,0,21,1})

-- Обхождане на д.п. дърво. Възлите се получават в нарастващ ред.
bst_traverse(bstree)
print()

-- Истинско изброяване на двоично дърво: възлите не се печатат, а от тях се
-- образува редица, в случая итератор. Итераторът е реализиран чрез съпрограма.
function treenodes(t)
  local function btr(t)
    if t.value then
      btr(t.left)
      coroutine.yield(t.value)
      btr(t.right)
    end
  end
  return coroutine.wrap(function() btr(t) end)
end

-- Обхождане на същото д.п. дърво чрез итератора.
for x in treenodes(bstree) do io.write(x,' ') end
print()

-- Обхождане и преобразуване на същото д.п. дърво чрез итератора в map.
print(table.concat(map(function(x) return 5*x end,function() return treenodes(bstree) end),' '))

-- Обхождане на същото д.п. дърво чрез итератора – пропускаме няколко първи, вземаме няколко следващи члена.
f = treenodes(bstree)
for i = 1, 5 do f() end
a,b,c,d = f(),f(),f(),f()
io.write(a,' ',b,' ',c,' ',d,'\n')
print()
