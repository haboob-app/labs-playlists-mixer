# Playlists Mixer - Configuration Examples

*Playlists*
* s = salsa list
* b = bachata list
* k = kizomba list
* p = porro list

*Config*
* s-4-2: salsa list with proportion 4 and continuous songs 2
* k-2-1: salsa list with proportion 2 and continuous songs 1

*Result*
* s-t1: salsa list track 1
* k-t2: kizomba list track 2

## Example 1
**Config:**
```
s-1-1, b-1-1, k-1-1, p-1-1
```
**Merged list**:
```
s-t1, b-t1, k-t1, p-t1,
s-t2, b-t2, k-t2, p-t2,
...
```

## Example 2
**Config:**
```
s-2-1, b-2-1, k-1-1, p-1-1
```
**Merged list**:
```
s-t1, b-t1,
s-t2, b-t2, k-t1, p-t1,
s-t3, b-t3,
s-t4, b-t4, k-t2, p-t2,
...
```

## Example 3
**Config:**
```
s-2-2, b-2-1, k-1-1, p-1-1
```
**Merged list**:
```
s-t1, s-t2, b-t1,
s-t3, s-t4, b-t2, k-t1, p-t1,
s-t5, s-t6, b-t3,
s-t7, s-t8, b-t4, k-t2, p-t2,
...
```

## Example 4
**Config:**
```
s-2-2, b-2-1, k-1-2, p-1-1
```
**Merged list**:
```
s-t1, s-t2, b-t1,
s-t3, s-t4, b-t2, k-t1, k-t2, p-t1,
s-t5, s-t6, b-t3,
s-t7, s-t8, b-t4, k-t3, k-t4, p-t2, 
...
```
