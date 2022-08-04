import React from 'react';
import { NextPage } from 'next';
import { Button } from 'ui';
import { ITodo } from 'models';

const Web: NextPage = () => {
  const dummyData: ITodo[] = [
    {
      id: 1,
      title: 'Első',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      deadline: new Date(),
    },
    {
      id: 2,
      title: 'Második',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      deadline: new Date(),
    },
    {
      id: 3,
      title: 'Harmadik',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      deadline: new Date(),
    },
  ];
  return (
    <div>
      <h1>Web</h1>
      <ul>
        {dummyData.map((data) => (
          <li key={data.id}>
            <h2>{data.title}</h2>
            <p>{data.description}</p>
          </li>
        ))}
      </ul>
      <Button type="button">Click me!</Button>
    </div>
  );
};

export default Web;
