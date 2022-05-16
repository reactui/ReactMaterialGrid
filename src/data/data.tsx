export const data:any =
    [{
      id: 1,
      name: 'a',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 63,
      sex: 'Male',
      type: 'adult',
    },
    {
      id: 2,
      name: 'b',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 34,
      sex: 'Female',
      type: 'adult',
      parentId: 1,
    },
    {
      id: 3,
      name: 'c',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      parentId: 1,
    },
    {
      id: 4,
      name: 'd',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      parentId: 3,
    },
    {
      id: 5,
      name: 'e',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 34,
      sex: 'Female',
      type: 'child',
    },
    {
      id: 6,
      name: 'f',
      surname: 'Baran',
      birthYear: 1987,
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      parentId: 5,
    }
]

export const columns:any = [
    { title: 'Adı', field: 'name' },
    { title: 'Soyadı', field: 'surname' },
    { title: 'Cinsiyet', field: 'sex' },
    { title: 'Tipi', field: 'type', removable: false },
    { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
    {
      title: 'Doğum Yeri',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    }
]