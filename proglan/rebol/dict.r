rebol [Title: Превод на думи между български и английски с използване на речника http://sa.dir.bg]

while [not empty? str: form parse input { ^-}] [  ; разбиване на входен ред на части и проверяване за непразнота
  cgi-str: make string! {}      ; начало на образуване на низ-заявка
; превръщане на всяка буква в 16-но цяло, извличане на последните две цифри, добавяне на % и това към заявката
  foreach c str [append cgi-str join {%} skip tail to-hex to-integer c -2]
  parse
    read to-url join {http://sa.dir.bg/cgi/sabig.cgi?word=} cgi-str       ; образуване на заявка, получаване на съдържание
    [[thru {<TD}] [to {<TD}] p: to {</TD>} q: (s: copy/part p q) to end]  ; извличане (от parse) в s частта между <TD> и </TD>
  trim/lines s                  ; премахване на шпации в повече между думи, а също начални и крайни и нови редове
  replace/all s {<BR>} {^/}     ; заменяне на всички <BR> с нов ред
  replace/all s {^/^/} {^/}     ; премахване на празните редове (нов ред непосредствено след нов ред е празен ред)
  while [parse s [to {<} p: thru {>} q: to end]]   ; намиране и премахване на всички останали маркери <...>
    [remove/part p q]
  print s                       ; извеждане на резултата
]
