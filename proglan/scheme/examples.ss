; encoding: utf-8
#!r6rs
(import (rnrs))

; намиране на корените на квадратно уравнение

(display                      ; израз с локално зададени
  (let ((a 2) (b -3) (c 1))   ; стойности на коефициентите
    (let ((d (sqrt (- (* b b) (* 4 a c)))) (a2 (* 2 a)))
      (cons (/ (- (+ b d)) a2) (/ (- d b) a2)))))
(newline)

(define (sqroots a b c)   ; функция с коефициентите като параметри
  (let ((d (sqrt (- (* b b) (* 4 a c)))) (a2 (* 2 a)))
    (list (/ (- (+ b d)) a2) (/ (- d b) a2))))

; намиране на обърнат списък

(define (rev-1 xs)       ; тромаво (n²) и със същинска (не финална) рекурентност
  (if (null? xs) '()
    (append (rev-1 (cdr xs)) (list (car xs)))))

(define (rev-2 xs)       ; натрупване чрез вложена рекурентна функция
  (define (f xs ys)
    (if (null? xs) ys
      (f (cdr xs) (cons (car xs) ys))))
  (f xs '()))

(define (rev-3 xs)       ; вложена рекурентна функция чрез letrec
  (letrec
    ((f (lambda (xs ys)
          (if (null? xs) ys
            (f (cdr xs) (cons (car xs) ys))))))
    (f xs '())))

(define (rev-4 xs)       ; вложена рекурентна функция чрез let с етикет
  (let f ((xs xs) (ys '()))
    (if (null? xs) ys
      (f (cdr xs) (cons (car xs) ys)))))

(define (rev-5 xs . ys)  ; финална рекурентност с натрупване без помощна функция
  (if (null? ys)
    (rev-5 xs '())
    (let ((ys (car ys)))
      (if (null? xs) ys
        (rev-5 (cdr xs) (cons (car xs) ys))))))

(define rev-6            ; като rev-5, но вторият аргумент не е допълнително опакован в списък
  (case-lambda
    ((xs) (rev-6 xs '()))
    ((xs ys) (if (null? xs) ys
               (rev-6 (cdr xs) (cons (car xs) ys))))))

(define (rev-7 xs)
  (do ((xs xs (cdr xs))
       (ys '() (cons (car xs) ys)))
    ((null? xs) ys)))

; сбор, произведение и алтерниращо сумиране

(display (fold-left + 0 '(3 5 8))) (newline)
(display (fold-right + 0 '(3 5 8))) (newline)
(display (fold-left * 1 '(3 5 8))) (newline)
(display (fold-right * 1 '(3 5 8))) (newline)
(display (fold-left - 0 '(3 5 8))) (newline)
(display (fold-right - 0 '(3 5 8))) (newline)

; възпроизвеждане на списък и „антисписък“

(display (fold-right cons '() '(a b c))) (newline)
(display (fold-left cons '() '(a b c))) (newline)

; образуване на списък от m,m+1,… до не повече от n

(define (seq m n)
  (if (<= m n) (cons m (seq (+ 1 m) n)) '()))

; намиране на дължина на списък

(define (list-len a)
  (fold-left (lambda (n x) (+ 1 n)) 0 a))

; пресмятане на полином

(define (poly cs x) (fold-left (lambda (v c) (+ (* v x) c)) 0 cs))

; отново намиране на обърнат списък; финалнорекурентна библиотечна функция

(define (rev-8 xs) (fold-left (lambda (rs x) (cons x rs)) '() xs))

; списък от простите стойности („атомите“) на списък

(define (flatten a)
  (cond
    ((null? a) '())
    ((pair? a) (append (flatten (car a)) (flatten (cdr a))))
    (else (list a))))

; сливане на два подредени (ненамаляващи) числови списъка

(define (merge a b)
  (cond
    ((null? a) b)
    ((null? b) a)
    (else (let ((x (car a)) (y (car b)))
            (if (<= x y)
              (cons x (merge (cdr a) b))
              (cons y (merge a (cdr b))))))))

; сливане на какъв да е брой подредени списъци

(define (merge . x)
  (define (f a b)
    (cond
      ((null? a) b)
      ((null? b) a)
      (else (let ((x (car a)) (y (car b)))
              (if (<= x y)
                (cons x (f (cdr a) b))
                (cons y (f a (cdr b))))))))
  (fold-left f '() x))

; обща функция за образуване на функция с множество аргументи от функция с два
; аргумента

(define (tofold f u)
  (lambda a (fold-left f u a)))

; сливане, но без отделна функция за основния случай

(define merge
  (case-lambda
    ((a b)
      (cond
        ((null? a) b)
        ((null? b) a)
        (else (let ((x (car a)) (y (car b)))
                (if (<= x y)
                  (cons x (merge (cdr a) b))
                  (cons y (merge a (cdr b))))))))
    (a (fold-left merge '() a))))

; двойка от списъци: разделяне на списък на две (с едно (частично) обхождане)

(define (split-at n xs)
  (if (= 0 n)
    (cons '() xs)
    (let ((rs (split-at (- n 1) (cdr xs))))
      (cons (cons (car xs) (car rs)) (cdr rs)))))

; списък от първия, последния, втория, предпоследния и т.н. членове на списък;
; сложността е точно 3n: всяко от length, interweave и (split-at + reverse) е n

(define (volute xs)
  (let ((p (split-at (div (+ 1 (length xs)) 2) xs)))
    (define (interweave as bs)
      (if (null? as) '()
        (cons (car as) (interweave bs (cdr as)))))
    (interweave (car p) (reverse (cdr p)))))

; премахване на повторения на последователни членове в списък

(define (uniq xs)
  (if (> 2 (length xs))
    xs
    (let ((x (car xs)) (y (cadr xs)))
      (if (equal? x y)
        (uniq (cons x (cddr xs)))
        (cons x (uniq (cdr xs)))))))

; действия със списъци-множества: разлика, обединение, сечение и симетрична
; разлика; работят правилно само ако аргументите не съдържат повторени членове

(define (set-difference a b)
  (fold-right remove a b))

(define (set-union a b)
  (append a (set-difference b a)))

(define (set-intersection a b)
  (filter (lambda (x) (member x b)) a))

(define (set-symmetric-difference a b)
  (append (set-difference a b) (set-difference b a)))

; симетрична разлика без set-difference и без fold-right, с вложена рекурентна
; натрупваща функция; работи правилно дори ако аргументите съдържат повторени
; членове

(define (set-symmetric-difference-direct as bs)
  (define (f xs ys zs)
    (if (null? xs) (append (reverse zs) ys)
      (let* ((x (car xs)) (xs (remove x (cdr xs))))
        (if (member x ys)
          (f xs (remove x ys) zs)
	  (f xs ys (cons x zs))))))
  (f as bs '()))

(display (set-symmetric-difference-direct '(a b c b a d) '(c a e))) (newline)

; (основа на) множество: списък от членовете на списък, всеки взет по веднъж
; и изброени според реда на първото им срещане

(define (nub xs)
  (if (null? xs) '()
    (let ((x (car xs)))
      (cons x (nub (remove x (cdr xs)))))))

(display (nub '(a b r a c a d a b r a))) (newline)

; построяване и обхождане на двоично подреждащо дърво

(define (bst-insert t x)
  (if t
    (let ((y (car t)) (t1 (cadr t)) (t2 (cddr t)))
      (if (<= x y)
        (cons* y (bst-insert t1 x) t2)
        (cons* y t1 (bst-insert t2 x))))
    `(,x #f . #f)))

(define (list->bst ns) (fold-left bst-insert #f ns))

(define (bst->list t)
  (if t
    (let ((x (car t)))
      (append (bst->list (cadr t)) (cons x (bst->list (cddr t)))))
    '()))

(display (bst->list (list->bst '(3 1 2 5 4)))) (newline)

; списък от листата на двоично дърво; представянето е () за празно
; и (ляво корен дясно) за непразно дърво

(define (bleaves t)
  (if (null? t) '()
    (let ((rt (cadr t)) (t1 (car t)) (t2 (caddr t)))
      (if (and (null? t1) (null? t2))
        (list rt)
        (append (bleaves t1) (bleaves t2))))))

(display (bleaves '((() (a b c) ()) () (() (x y) ())))) (newline)

; композиция на map и съединяване на списъци

(define (append-map f q)
  (fold-right append '() (map f q)))
; (apply append (map f q)))

; обхождане на дърво: листа, префиксно, суфиксно и послойно

(define (leaves t)
  (if (null? t) '()
    (let ((h (cdr t)))
      (if (null? h)
        (list (car t))
        (append-map leaves h)))))

(define (pre-order t)
  (if (null? t) '()
    (cons (car t) (append-map pre-order (cdr t)))))

(define (post-order t)
  (if (null? t) '()
    (fold-right append (list (car t)) (map post-order (cdr t)))))

(define (level-order t)
  (define (f q)
    (if (null? q) '()
      (cons (map car q) (f (append-map cdr q)))))
  (if (null? t) '() (f (list t))))

(display (level-order '(1 (a (b) (c)) (3) (4 (c4))))) (newline)

; декартово произведение на списъци
; (foldr (\as bss -> concatMap (\a -> map (a:) bss) as) [[]] ass)

(define (cartesian-product . ass)
  (fold-right
    (lambda (as bss)
      (append-map
        (lambda (a)
          (map (lambda (bs) (cons a bs)) bss))
        as))
    (list '())
    ass))

(display (cartesian-product '(a b c) '(d) '(e f))) (newline)

(exit)
