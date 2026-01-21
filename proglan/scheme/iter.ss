#!/usr/bin/scheme
(import (rnrs))

; Ако се компилира с едно от следните (първото дава по-малка и по-бърза програма)
;
;       echo '(compile-program "iter.ss")' | scheme -q
;       echo '(compile-script "iter.ss")' | scheme -q
;
; може да се изпълни по кой да е от трите начина:
;
;       scheme --program iter.so
;       scheme --script iter.so
;       ./iter.so
;
; Ако се компилира с
;
;       echo '(compile-file "iter.ss")' | scheme -q
;
; може да се изпълни с
;
;       scheme --program iter.so

; Образува генератор на даннова структура d.
; Функцията g поражда членовете на тази структура и се повиква с два
; параметъра – d и функция, която прилага към всеки член на d.
; Генераторът дава резултат списък с член получената от g стойност.
; Празен списък означава, че генераторът е изчерпан – той не бива
; да бъде повикван повече, иначе възниква грешка
(define [make-generator g d]
  (letrec
    ([cont (lambda [] (g d resume) (cont '()))]
     [resume (lambda v
               (call/cc
                 (lambda [c]
                   (let ([k cont]) (set! cont c)
                                   (if (null? v) (k) (k v))))))])
    resume))

; Итератор – повиква без аргументи генератор gen за пораждане
; на редица от стойности и функция use за всяка стойност
(define [for gen use]
  (do ([v (gen) (gen)])
    ([null? v])
    (use (car v))))

(define [bt-inorder t process]
  (let f ([t t])
    (when (not (null? t))
      (f (btree-left t))
      (process (btree-node t))
      (f (btree-right t)))))

(define-record-type btree (fields node left right))

(define bt
  (make-btree 'a
    (make-btree 'b
      (make-btree 'd
        '()
        (make-btree 't '() '()))
      (make-btree 'e '() '()))
    (make-btree 'c
      (make-btree 'r
        '()
        (make-btree 'u '() '()))
      (make-btree 's
        (make-btree 'v '() '())
        '()))))

(define [print x] (write x) (display #\space))

(bt-inorder bt print)
(newline)

(define gbt)
(set! gbt (make-generator bt-inorder bt))

(for gbt print)
(newline)

(set! gbt (make-generator bt-inorder bt))
(apply print (gbt)) (newline)
(apply print (gbt)) (newline)
(display "---\n")
(gbt) (gbt) (gbt)
(apply print (gbt)) (newline)

(exit)
