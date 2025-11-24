import db from '../db.js';
import { nanoid } from 'nanoid';

export const listTasks = async (req, res) => {
  await db.read();
  res.json(db.data.tasks);
};

export const getTask = async (req, res) => {
  const id = req.params.id;
  await db.read();
  const t = db.data.tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ message: 'Not found' });
  res.json(t);
};

export const createTask = async (req, res) => {
  const { titulo, descripcion, foto, latitud, longitud } = req.body;
  if (!titulo) return res.status(400).json({ message: 'titulo required' });

  const nueva = {
    id: nanoid(),
    titulo,
    descripcion: descripcion || '',
    foto: foto || null,
    latitud: latitud ?? null,
    longitud: longitud ?? null,
    createdAt: new Date().toISOString()
  };

  await db.read();
  db.data.tasks.push(nueva);
  await db.write();
  res.status(201).json(nueva);
};

export const updateTask = async (req, res) => {
  const id = req.params.id;
  const { titulo, descripcion, foto, latitud, longitud } = req.body;
  await db.read();
  const index = db.data.tasks.findIndex(x => x.id === id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });

  db.data.tasks[index] = {
    ...db.data.tasks[index],
    titulo: titulo ?? db.data.tasks[index].titulo,
    descripcion: descripcion ?? db.data.tasks[index].descripcion,
    foto: foto ?? db.data.tasks[index].foto,
    latitud: latitud ?? db.data.tasks[index].latitud,
    longitud: longitud ?? db.data.tasks[index].longitud,
    updatedAt: new Date().toISOString()
  };

  await db.write();
  res.json(db.data.tasks[index]);
};

export const deleteTask = async (req, res) => {
  const id = req.params.id;
  await db.read();
  const before = db.data.tasks.length;
  db.data.tasks = db.data.tasks.filter(x => x.id !== id);
  await db.write();
  if (db.data.tasks.length === before) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'deleted' });
};