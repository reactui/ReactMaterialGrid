export const data:any =
    [{
      id: 1,
      name: 'John',
      surname: 'Smith',
      birthYear: 1987,
      birthCity: 'Los Angeles',
      sex: 'Male',
      type: 'adult',
    },
    {
      id: 2,
      name: 'Ivan',
      surname: 'Medvede',
      birthYear: 1978,
      birthCity: 'Pasadena',
      sex: 'Male',
      type: 'adult',
      parentId: 1,
    },
    {
      id: 3,
      name: 'Mike',
      surname: 'Tyson',
      birthYear: 1970,
      birthCity: 'New York',
      sex: 'Male',
      type: 'Male',
      parentId: 1,
    },
    {
      id: 4,
      name: 'Jane',
      surname: 'Done',
      birthYear: 2017,
      birthCity: 34,
      sex: 'Female',
      type: 'child',
      parentId: 3,
    },
    {
      id: 5,
      name: 'Mike',
      surname: 'Johnson',
      birthYear: 1987,
      birthCity: 'Berlin',
      sex: 'male',
      type: 'adult',
    },
    {
      id: 6,
      name: 'Audrie',
      surname: 'Pendelton',
      birthYear: 2006,
      birthCity: 'London',
      sex: 'Female',
      type: 'child',
      parentId: 5,
    }
]

export const columns:any = [
    { title: 'First Name', field: 'name' },
    { title: 'Last Name', field: 'surname' },
    { title: 'M / F', field: 'sex' },
    { title: 'Type', field: 'type', removable: false },
    { title: 'Year of birth', field: 'birthYear', type: 'numeric' },
    {
      title: 'City',
      field: 'birthCity',
      lookup: { 'London': 'London', 'New York' : 'New York' },
    }
]