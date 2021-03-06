n = 2106833293
# p = 104729 
# q = 20117 
e = 45897
d = 1043738009

def power(x, y):
    if y==0: return 1
    t = power(x, y//2)
    if y%2: return (t*t*x)%n
    return (t*t)%n

def encrypt(x):
    print(x)
    return stringify(power(x, e))

def decrypt(x):
    return power(strtoint(x),d)

def ntos(x):
    if x<10:
        return str(x)
    return chr(97 + x - 10)

def ston(x):
    try:
        x = int(x)
        return x
    except:
        x = ord(x) - 97 + 10
        return x

def stringify(x):
    ans = ''
    while(x):
        ans = ntos(x%36) + ans
        x = x//36
    return ans

def strtoint(x):
    ans = 0
    for c in x:
        ans = 36*ans + ston(c)
    return ans

