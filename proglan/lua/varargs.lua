-- Функции с неопределен брой аргументи

-- функция за сумиране на неопределен (0 или по-голям) брой числа
function sum(...)
  local s = 0
  for _,x in ipairs{...} do
    s = s+x
  end
  return s
end

-- примери за използване
print()
print(sum())            -- 0
print(sum(5,-4,8,2))    -- 11


-- функция за пресмятане на полином, зададен с коефициенти c,... (един или повече)
-- за стойност на променливата x
function poly(x,c,...)
  local v = c
  for _,c in ipairs{...} do
    v = v*x+c
  end
  return v
end

-- примери за използване
print()
print(poly(2,5))        -- 5
print(poly(2,3,-1,7))   -- 17
