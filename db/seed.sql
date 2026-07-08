INSERT INTO authors (name, email, bio) VALUES
('José Ferrer', 'jose@miniblog.com', 'Backend developer en formación, apasionado por el frontend y el marketing digital.'),
('Ana Torres', 'ana@miniblog.com', 'Escritora de tecnología y entusiasta del open source.'),
('Carlos Mena', 'carlos@miniblog.com', 'Desarrollador full stack con foco en APIs REST.');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Mi primer post en MiniBlog', 'Este es el contenido de mi primer post probando la API.', true),
(1, 'Aprendiendo PostgreSQL', 'Las foreign keys son la base de las relaciones en bases de datos relacionales.', false),
(2, 'Por qué Node.js es tan popular', 'Node.js permite usar JavaScript tanto en frontend como en backend.', true),
(3, 'Buenas prácticas en APIs REST', 'Usar códigos HTTP correctos mejora la comunicación entre frontend y backend.', true);