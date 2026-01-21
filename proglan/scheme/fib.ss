(define Y
  (lambda [f]
    ((lambda [x] (x x))
     (lambda [g]
       (f (lambda args (apply (g g) args)))))))

(define [memoize f]
  (define fm
    (let ([cache (make-hashtable equal-hash equal?)])
      (lambda [x]
        (if (hashtable-contains? cache x)
          (hashtable-ref cache x #f)
          (let ([res (f x fm)])
            (hashtable-set! cache x res)
            res)))))
  fm)

(define [fib n . f]
  (let ([f (if (null? f) fib (car f))])
    (if (< n 2)
      n
      (+ (f (- n 1)) (f (- n 2))))))

(define [m91 n . f]
  (let ([f (if (null? f) m91 (car f))])
    (if (> n 100) (- n 10) (f (f (+ n 11))))))

(define [tak n . f]
  (let ([x (car n)] [y (cadr n)] [z (caddr n)]
        [f (if (null? f) tak (car f))])
    (if (<= x y)
      y
      (f (list (f (list (- x 1) y z))
               (f (list (- y 1) z x))
               (f (list (- z 1) x y)))))))

(define [ack a . f]
  (let ([m (car a)] [n (cdr a)]
        [f (if (null? f) ack (car f))])
    (cond
      ([= m 0] (+ 1 n))
      ([= n 0] (f (cons (- m 1) 1)))
      (else (f (cons (- m 1) (f (cons m (- n 1)))))))))

(define fibonacci (memoize fib))

(define mccarthy (memoize m91))

(define takeuchi (memoize tak))
; по-бавно от рекурсивното (напр. за (1 0 12))!

(define ackerman (memoize ack))

(display (fibonacci 200))
(newline)
; пробвай fib и fibonacci за 35-37

(display (mccarthy -100000))
(newline)

(display (takeuchi '(8 5 3)))
(newline)

(display (ackerman '(3 . 16)))
(newline)
