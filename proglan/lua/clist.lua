-- Действия с линеен цикличен списък. Списъкът се образува от членове-таблици.
-- Всяка таблица – член на списък има полета с имена data (съдържание) и next (препратка към следващия член).
-- Посочването на списък става с препратка към последния му елемент.

-- Отпечатване на съдържанието на списък.
function printlist(h)
  if h == nil then return end
  local p = h.next
  while true do
    print(p.data)
    if p == h then break end
    p = p.next
  end
end

-- Добавяне на възел със стойността x към списък h.
-- Ако front присъства и е true, добавя се в началото на списъка, иначе в края.
function clinsert(h,x,front)
  if h == nil then
    h = {data = x}
    h.next = h
  else
    local p = {data = x, next = h.next}
    h.next = p
    if front ~= true then h = p end
  end
  return h
end

-- Премахване на началния елемент на списък h.
function remove(h)
  if h.next == h then
    return nil
  else
    h.next = h.next.next
    return h
  end
end

-- Обръщане на списък (без образуване на нови членове – сменят се само връзките).
function clreverse(h)
  if h == nil or h.next == h then return h end
  local p, q = h, h.next
  repeat
    local k = q.next
    q.next = p
    p = q
    q = k
  until p == h
  return q
end

-- Пример: образуване на списък чрез четене на стойности от стандартния вход,
-- показване на съдържанието, обръщане и отново показване на съдържанието.
h = nil
for s in io.lines() do
  h = clinsert(h,s)
end

print()
printlist(h)

h = clreverse(h)
h = remove(h)
h = remove(h)

print()
printlist(h)
