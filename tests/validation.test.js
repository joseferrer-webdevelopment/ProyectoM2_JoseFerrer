const request = require('supertest');
const app = require('../app');
const { errorHandler } = require('../middlewares/errorHandler');

describe('validación de solicitudes', () => {
  it('rechaza un author sin nombre válido antes de consultar la base de datos', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ name: '   ', email: 'ana@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('name es obligatorio y no puede estar vacío');
  });

  it('rechaza emails sin dominio', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ name: 'Laura Gómez', email: 'laura@miniblog' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('email debe tener un formato válido');
  });

  it('rechaza un post sin contenido antes de consultar la base de datos', async () => {
    const response = await request(app)
      .post('/posts')
      .send({ authorId: 1, title: 'Título válido', content: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('content es obligatorio y no puede estar vacío');
  });

  it('rechaza ids no numéricos', async () => {
    const response = await request(app).get('/authors/no-es-un-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('id debe ser un número entero positivo');
  });
});

describe('manejador centralizado de errores', () => {
  it('convierte una restricción unique de PostgreSQL en 409', () => {
    const req = {};
    const res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler({ code: '23505' }, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ya existe un registro con esos datos únicos' });
    expect(next).not.toHaveBeenCalled();
  });
});
