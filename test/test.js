import test from 'tape'
import _ from 'lodash'

import Dodo from '../src/dodo'
import table from './fixture/table'
const array = [...table]
const Index = table.index

test('no actions', t => {
  const dodo = new Dodo(table)
  t.equal(dodo.actions.length, 0)
  t.same([...dodo], array)
  t.end()
})

test('throws without an array', t => {
  t.throws(() => new Dodo())
  t.end()
})

test('slice', t => {
  const dodo = new Dodo(table)
  t.same(
    [...dodo.slice(0, 2)],
    array.slice(0, 2)
  )
  t.same(
    [...dodo.slice(1, 2)],
    array.slice(1, 2)
  )
  t.same(
    [...dodo.slice(0, array.length)],
    array
  )
  t.same(
    [...dodo.slice(0)],
    array
  )
  t.same(
    [...dodo.slice()],
    array
  )
  t.throws(dodo.slice.bind(dodo, 2, 2))
  t.end()
})

test('slice shorthand: take', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.take(10).toArray(),
    array.slice(0, 10)
  )
  t.end()
})

test('slice shorthand: skip', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.skip(3).toArray(),
    array.slice(3)
  )
  t.end()
})

test('slice + slice', t => {
  const dodo = new Dodo(table)
  t.same(
    [...dodo.slice(0, 2).skip(2)],
    array.slice(0, 2).slice(2)
  )
  t.same(
    [...dodo.slice(1, 2).slice(0)],
    array.slice(1, 2)
  )
  t.same(
    [...dodo.slice(0, 2).slice(1, 2)],
    array.slice(0, 2).slice(1, 2)
  )
  t.same(
    [...dodo.slice(0, 2).take(3)],
    array.slice(0, 2).slice(0, 3)
  )
  t.same(
    [...dodo.slice(0, 5).slice(0, 2)],
    array.slice(0, 2)
  )
  t.same(
    [...dodo.slice(1).slice(0, 2)],
    array.slice(1).slice(0, 2)
  )
  t.throws(dodo.slice(2).slice.bind(dodo, 2, 2))
  t.end()
})

test('filter', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.filter((row, I) => row[I.Date] == 4).toArray(),
    array.filter(row => row[Index.Date] == 4)
  )
  t.same(
    dodo.filter((row, I) => row[I.Date] <= 4).toArray(),
    array.filter(row => row[Index.Date] <= 4)
  )
  t.same(
    dodo.filter((row, I) => row[I.Age] <= 4 && row[I.Weight] == 2).toArray(),
    array.filter(row => row[Index.Age] <= 4 && row[Index.Weight] == 2)
  )
  t.throws(() => dodo.filter())
  t.throws(() => dodo.filter('not a function'))
  t.end()
})

test('filter shorthand: filterBy', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.filterBy('Date', d => d == 4).toArray(),
    array.filter(row => row[Index.Date] == 4)
  )
  t.same(
    dodo.filterBy('Age', a => a <= 4).toArray(),
    array.filter(row => row[Index.Age] <= 4)
  )
  t.end()
})

test('filter + filter', t => {
  const dodo = new Dodo(table)
  const expected = array
    .filter(row => row[Index.Date] == 4)
    .filter(r => r[Index.Weight] == 2)

  t.same(
    dodo
      .filter((r,I) => r[I.Date] == 4)
      .filter((r,I) => r[I.Weight] == 2)
      .toArray(),
    expected
  )
  t.same(
    dodo.filter((r, I) => r[I.Date] == 4 && r[I.Weight] == 2).toArray(),
    expected
  )
  t.end()
})

test('map', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.map((row, I) => row[I.Date]).toArray(),
    array.map(row => row[Index.Date])
  )
  t.same(
    dodo.map((row, I) => row[I.Date] * 2).toArray(),
    array.map(row => row[Index.Date] * 2)
  )
  t.same(
    dodo.map((row, I) => row[I.Date] + row[I.Age]).toArray(),
    array.map(row => row[Index.Date] + row[Index.Age])
  )
  t.throws(() => dodo.map())
  t.throws(() => dodo.map('not a function'))
  t.end()
})

test('map shorthand: col', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.col('Date').toArray(),
    array.map(row => row[Index.Date])
  )
  t.throws(() => dodo.col('some column not in the index'))
  t.throws(() => dodo.col())
  t.end()
})

test('map shorthand: cols', t => {
  const dodo = new Dodo(table)
  const cols = ['Date', 'Age', 'Height']
  t.same(
    dodo.cols(cols).toArray(),
    array.map(row => cols.map(col => row[Index[col]]))
  )
  t.throws(() => dodo.cols([...cols, 'Column that does not exist']))
  t.end()
})

test('multiple maps', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.col('Date').map(d => d * 2).toArray(),
    array.map(row => row[Index.Date]).map(d => d * 2)
  )
  const cols = ['Age', 'Date', 'Height', 'Weight']
  t.same(
    [...dodo.cols(cols).col('Date')],
    array.map(row => row[Index.Date])
  )
  const colsAfter = ['Age', 'Date']
  t.same(
    [...dodo.cols(cols).cols(colsAfter)],
    array.map(row => colsAfter.map(col => row[Index[col]]))
  )
  t.end()
})

test('map + filter', t => {
  const dodo = new Dodo(table)
  const expected = array
    .filter(row => row[Index.Date] > 3)
    .map(row => row[Index.Date])

  t.same(
    dodo.filter((row, I) => row[I.Date] > 3).col('Date').toArray(),
    expected
  )
  t.same(
    dodo.col('Date').filter(a => a > 3).toArray(),
    expected
  )
  t.same(
    [...dodo
      .col('Date')
      .filter(a => a > 3)
      .map(a => a * 2)
      .filter(a => a > 8)],
    array
      .map(row => row[Index.Date])
      .filter(a => a > 3)
      .map(a => a * 2)
      .filter(a => a > 8)
  )
  const cols = ['Age', 'Date']
  t.same(
    [...dodo
      .cols(cols)
      .filter((row, I) => row[I.Date] == 7)],
    array
      .map(row => cols.map(col => row[Index[col]]))
      .filter(row => row[1] == 7)
  )
  t.same(
    [...dodo
      .filter((row, I) => row[I.Height] == 7)
      .cols(cols)
      .filter((row, I) => row[I.Age] == 5)
      .col('Date')],
    array
      .filter(row => row[Index.Height] == 7)
      .map(row => cols.map(col => row[Index[col]]))
      .filter(row => row[cols.indexOf('Age')] == 5)
      .map(row => row[cols.indexOf('Date')])
  )
  t.end()
})

test('map + slice', t => {
  const dodo = new Dodo(table)
  const expected = array.map(row => row[Index.Date] * 2).slice(2, 4)
  t.same(
    dodo.map((row, I) => row[I.Date] * 2).slice(2, 4).toArray(),
    expected
  )
  t.same(
    dodo.slice(2, 4).map((row, I) => row[I.Date] * 2).toArray(),
    expected
  )
  // TODO: map + slice + map + slice
  // TODO: slice + map + slice + map
  t.end()
})

test('filter + slice', t => {
  const dodo = new Dodo(table)
  t.same(
    [...dodo.filter((row, I) => row[I.Date] == 4).slice(1)],
    array.filter(row => row[Index.Date] == 4).slice(1)
  )
  t.same(
    [...dodo.slice(1).filter((row, I) => row[I.Date] == 4)],
    array.slice(1).filter(row => row[Index.Date] == 4)
  )
  t.same(
    dodo
      .filter((row, I) => row[I.Date] >= 4)
      .slice(1)
      .filter((row, I) => row[I.Height] == 7)
      .slice(0)
      .toArray(),
    array
      .filter(row => row[Index.Date] >= 4)
      .slice(1)
      .filter(row => row[Index.Height] == 7)
      .slice(0)
  )
  t.same(
    dodo
      .slice(1)
      .filter((row, I) => row[I.Date] >= 4)
      .slice(1)
      .filter((row, I) => row[I.Height] == 7)
      .toArray(),
    array
      .slice(1)
      .filter(row => row[Index.Date] >= 4)
      .slice(1)
      .filter(row => row[Index.Height] == 7)
  )
  t.end()
})

test('uniq', t => {
  const dodo = new Dodo(table)
  t.true(Array.isArray(dodo.col('Date').uniq()))
  t.same(
    dodo.col('Date').uniq(),
    [...new Set(array.map(row => row[Index.Date]))]
  )
  t.end()
})

test('reduce of single column', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.col('Age').reduce((acc, a) => acc * a, 1),
    array.map(row => row[Index.Age]).reduce((acc, a) => acc * a, 1)
  )
  t.end()
})

test('reduce over multiple columns', t => {
  const dodo = new Dodo(table)
  t.same(
    dodo.reduceEach((acc, a) => acc + a, 0),
    Object.values(Index)
      .map(i => array.reduce((arr, row) => [...arr, row[i]], []))
      .map(arr => arr.reduce((acc, a) => acc + a, 0))
  )
  t.end()
})

test('reduce shorthands', t => {
  const dodo = new Dodo(table)
  const shorthands = [
    ['count', arr => arr.length],
    ['sum', arr => arr.reduce((a, b) => a + b, 0)],
    ['min', arr => Math.min(...arr)],
    ['max', arr => Math.max(...arr)],
    ['mean', arr => _.mean(arr)],
  ]
  const col = 'Date'
  const cols = ['Date', 'Age']
  for (const s of shorthands)
    t.test(s[0], t => {
      t.same(
        dodo.col(col)[s[0]](),
        s[1](array.map(row => row[Index.Date])),
        `${s[0]} over 1 column`
      )
      t.same(
        dodo.cols(cols)[s[0]](),
        cols
          .map(col => array.map(row => row[Index[col]]))
          .map(col => s[1](col)),
          `${s[0]} over several columns`
      )
      t.end()
    })
  t.end()
})

test('groupBy', t => {
  const dodo = new Dodo(table)
  const grouped = dodo.groupBy('Age')
  const ageUniques = dodo.col('Age').uniq()

  ageUniques.forEach(uniq => {
    t.true(grouped.has(uniq), `uniq ${uniq} is missing`)
    t.true(grouped.get(uniq) instanceof Dodo,
      `value of uniq ${uniq} is not a dodo`)
  })

  t.test('Dodo prototype methods present', t => {
    const methods = new Set(Object.getOwnPropertyNames(grouped))
    for (const method of Object.getOwnPropertyNames(Dodo.prototype)) {
      if (method == 'constructor') continue
      t.true(methods.has(method), method + ' not present')
      t.true(typeof grouped[method] == 'function', method + ' not function')
    }
    t.end()
  })

  t.test('groupBy().map()', t => {
    const mappedGrouped = grouped.col('Date')
    ageUniques.forEach(uniq => {
      t.true(mappedGrouped.has(uniq), `uniq ${uniq} is missing`)
      t.true(mappedGrouped.get(uniq) instanceof Dodo,
        `value of uniq ${uniq} is not a dodo`)

      const expected = dodo.filter((row, I) => row[I.Age] == uniq).col('Date')
      t.same(
        mappedGrouped.get(uniq).toArray(),
        expected.toArray()
      )
      t.same(
        mappedGrouped.toArray().get(uniq),
        expected.toArray()
      )
    })
    t.end()
  })

  t.test('Dodo prototype methods absent after toArray', t => {
    const groupedToArray = grouped.toArray()
    const methods = new Set(Object.getOwnPropertyNames(groupedToArray))
    for (const method of Object.getOwnPropertyNames(Dodo.prototype)) {
      if (method == 'constructor') continue
      t.false(methods.has(method), method + ' present')
    }
    t.end()
  })

  t.end()
})
