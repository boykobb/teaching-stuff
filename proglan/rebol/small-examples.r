REBOL []

; Извежда „отвесно“ стойността v.
; n ≥ 0 е равнището на влагане, подразбира се 0.
vdisp: func [v /at n] [
  if not at [n: 0]
  loop n [prin {  }]
  prin type? v
  prin {: }
  either block? v [
    print {}
    foreach u v [vdisp/at u 1 + n]
  ] [
    print v
  ]
]

; Калкулатор – чете и изпълнява редове от следния вид:
;   • аритметични изрази – като в REBOL, включително с променливи;
;   • = <дума> – присвоява последната пресметната стойност на посочената променлива.
; Празните редове остават без последствие.
; Край на входа е думата end.
; Не се проверява за погрешен вход.
forever [
  s: parse input { }
  if not empty? s [
    if (lowercase s/1) = {end} [break]
    either s/1 = {=}
      [set to-word s/2 v]
      [print v: do form s]
  ]
]

; Както например в Haskell zip и zipWith.
; Итеративна версия.
zip: func [as bs /with f] [
  if not with [f: func [a b] [reduce [a b]]]
  cs: copy []
  pa: as  pb: bs
  while [not any [empty? pa empty? pb]] [
    append/only cs do :f pa/1 pb/1
;   append/only cs do get 'f pa/1 pb/1
    pa: next pa  pb: next pb
  ]
  return cs
]

print zip/with [1 2 3] [100 200 300 9] 'add

; Рекурсивна версия.
zip: func [as bs /with f] [
  if not with [f: func [a b] [reduce [a b]]]
  either (empty? as) or (empty? bs)
    [copy []]
;   [back insert/only zip/with next as next bs :f do :f as/1 bs/1]
    [back insert/only zip/with next as next bs get 'f do get 'f as/1 bs/1]
]

; Образува редица (блок) от две стойности.
pair: func [x y] [reduce [x y]]

; Както в Haskell и другаде.
map: func [f as] [
  cs: copy []
  foreach a as [append/only cs do f a]
  return cs
]

print map 'negate [3 5 8]

print map (func [as] [
             s: 0
             forall as [s: s + as/1]
             return s
           ])
          [[1 2] [3] [4 5 6]]

; Като горното, но функцията за сумиране е реализирана чрез foldl.
print map func [xs] [foldl 'add 0 xs] [[1 2] [3] [4 5 6]]

; Както в Haskell и другаде.
foldl: func [f u as] [
  either empty? as [u] [foldl get 'f do f u as/1 next as]
]

foldr: func [f u as] [
  either empty? as [u] [do f as/1 foldr get 'f u next as]
]

; Пресмятане на полином.
polyl: func [cs t] [foldl func [r c] [r * t + c] 0 cs]
polyr: func [cs t] [foldr func [c r] [r * t + c] 0 cs]
print polyl [1 2 -1] 3
print polyr [1 2 -1] 3

; Като горното, но за аргументи на foldl/foldr се използват именовани функции.
pl: func [cs t /local fl] [
  fl: func [r c] [r * t + c]
  foldl 'fl 0 cs
]

pr: func [cs t /local fr] [
  fr: func [c r] [r * t + c]
  foldr 'fr 0 cs
]

print pl [1 2 -1] 3
print pr [1 2 -1] 3
