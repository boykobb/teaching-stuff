-- Образуване на функции-стойности (безименни функции),
-- съхраняващи и поделящи контекста, в който са образувани

-- функция, пораждаща функции-акумулатори
function agen(n)
  return function(k) n = n+k return n end
end

-- пример – пораждане и използване на два акумулатора
print()
f = agen(10)
g = agen(100)
print(f(1))     -- 11
print(f(1))     -- 12
print(g(3))     -- 103
print(f(2))     -- 14
print(g(7))     -- 110


-- функция, пораждаща двойка функции, изменящи едно и също число
-- (поделяне на контекст)
function fgen(n)
  return function(k) n = n+k return n end,
         function(k) n = n*k return n end
end

-- пример – пораждане и използване на една двойка функции
print()
add, mul = fgen(10)
print(add(2))   -- 12
print(add(3))   -- 15
print(mul(4))   -- 60
print(add(50))  -- 110
print(mul(10))  -- 1100
