-- GreenLine Perú — Integración nueva de artículos
-- Fuente: archivo 'Ponencia de GreenLine en la UPN.txt' proporcionado por el usuario.
--
-- Integración nueva, independiente de WordPress.
-- No contiene wordpress_post_id ni original_url.
-- El autor de todos los artículos se normaliza a: A. Yeren.
--
-- El archivo fuente expone texto, títulos, fechas y marcadores de imagen,
-- pero no entrega las URLs de las imágenes. Por eso image_url queda NULL
-- hasta que se migren/suban las imágenes.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS greenline_post_images;
DROP TABLE IF EXISTS greenline_posts;
DROP TABLE IF EXISTS greenline_categories;

CREATE TABLE greenline_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE greenline_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID NOT NULL
        REFERENCES greenline_categories(id)
        ON DELETE RESTRICT,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,

    author VARCHAR(100) NOT NULL DEFAULT 'A. Yeren',

    excerpt TEXT,
    content_html TEXT NOT NULL,
    content_text TEXT NOT NULL,

    image_url TEXT,
    image_alt TEXT,

    published_at DATE NOT NULL,

    featured BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE greenline_post_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    post_id UUID NOT NULL
        REFERENCES greenline_posts(id)
        ON DELETE CASCADE,

    image_url TEXT NOT NULL,
    image_alt TEXT,
    caption TEXT,

    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_greenline_posts_category_id ON greenline_posts(category_id);
CREATE INDEX idx_greenline_posts_published_at ON greenline_posts(published_at DESC);
CREATE INDEX idx_greenline_posts_active ON greenline_posts(active);
CREATE INDEX idx_greenline_posts_featured ON greenline_posts(featured);
CREATE INDEX idx_greenline_post_images_post_id ON greenline_post_images(post_id);
CREATE INDEX idx_greenline_post_images_order ON greenline_post_images(post_id, sort_order);

INSERT INTO greenline_categories (id, name, slug, description, sort_order)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Guías para tu vehículo',
    'guias-para-tu-vehiculo',
    'Contenido práctico para conocer, elegir y utilizar correctamente un vehículo eléctrico.',
    1
),
(
    '00000000-0000-0000-0000-000000000002',
    'Mantenimiento y cuidado',
    'mantenimiento-y-cuidado',
    'Consejos relacionados con el mantenimiento, cuidado y uso responsable del vehículo.',
    2
),
(
    '00000000-0000-0000-0000-000000000003',
    'Movilidad eléctrica',
    'movilidad-electrica',
    'Contenido sobre movilidad eléctrica, delivery, sostenibilidad y uso urbano.',
    3
),
(
    '00000000-0000-0000-0000-000000000004',
    'Noticias GreenLine',
    'noticias-greenline',
    'Noticias, activaciones, alianzas, eventos y novedades institucionales de GreenLine.',
    4
),
(
    '00000000-0000-0000-0000-000000000005',
    'Activaciones',
    'activaciones',
    'Activaciones, eventos, inauguraciones, alianzas y participaciones institucionales de GreenLine.',
    5
);

-- Artículos extraídos del archivo fuente.
INSERT INTO greenline_posts (
    category_id,
    title,
    slug,
    author,
    excerpt,
    content_html,
    content_text,
    image_url,
    image_alt,
    published_at,
    featured,
    active,
    sort_order
) VALUES
('00000000-0000-0000-0000-000000000004',
        'Ponencia de GreenLine en la UPN',
        'ponencia-de-greenline-en-la-upn',
        'A. Yeren',
        'El pasado 2 de junio participamos en una jornada de activación y ponencia en la sede Comas de la Universidad Privada del Norte (UPN), una oportunidad que nos permitió acercarnos a estudiantes y miembros de la comunidad universitaria para compartir nuestra experiencia en el sector de la movilidad eléctrica y promover conversaciones en torno a la sostenibilidad.',
        '<h2>Compartimos nuestra experiencia en movilidad eléctrica junto a la comunidad UPN Comas</h2>
<p>El pasado 2 de junio participamos en una jornada de activación y ponencia en la sede Comas de la Universidad Privada del Norte (UPN), una oportunidad que nos permitió acercarnos a estudiantes y miembros de la comunidad universitaria para compartir nuestra experiencia en el sector de la movilidad eléctrica y promover conversaciones en torno a la sostenibilidad.</p>
<p>Durante la actividad, realizamos una activación informativa donde los asistentes pudieron conocer más acerca de GreenLine, nuestras tiendas, los beneficios vigentes para la comunidad UPN y las distintas soluciones de movilidad que forman parte de nuestro catálogo. Además, compartimos material informativo sobre nuestros vehículos eléctricos y la presencia que hemos construido en distintas ciudades del país.</p>
<p>La ponencia abordó temas relacionados con el crecimiento de GreenLine desde sus inicios, nuestra expansión en Perú y Chile, y el papel que la movilidad eléctrica desempeña actualmente dentro de las alternativas de transporte sostenible. También presentamos las diferentes categorías de vehículos que ofrecemos, entre ellas bicicletas eléctricas, VMP, motos eléctricas, trimotos y vehículos cargueros, explicando las características generales de cada una y los distintos escenarios de uso para los que han sido diseñados.</p>
<p>Asimismo, dedicamos un espacio a resolver algunas de las consultas más frecuentes que suelen surgir alrededor de la movilidad eléctrica, como la documentación requerida para determinados vehículos, los tipos de baterías disponibles y los factores que pueden influir en la elección de una solución de movilidad según las necesidades de cada usuario.</p>
<p>Uno de los momentos más destacados de la jornada fue la dinámica de preguntas y respuestas realizada con los estudiantes. A través de una participación activa y diversas actividades, los asistentes pudieron poner a prueba los conocimientos adquiridos durante la charla y acceder a distintos premios preparados para la ocasión. Este intercambio permitió generar una conversación cercana y enriquecedora sobre los retos y oportunidades que presenta la movilidad eléctrica.</p>
<p>En GreenLine, valoramos este tipo de espacios porque nos permiten compartir conocimiento, escuchar nuevas perspectivas y acercar la movilidad eléctrica a más personas.</p>
<p>Seguiremos impulsando iniciativas junto a instituciones educativas y comunidades que, al igual que nosotros, buscan contribuir a un futuro más sostenible a través de la innovación y la educación.</p>',
        'Compartimos nuestra experiencia en movilidad eléctrica junto a la comunidad UPN Comas

El pasado 2 de junio participamos en una jornada de activación y ponencia en la sede Comas de la Universidad Privada del Norte (UPN), una oportunidad que nos permitió acercarnos a estudiantes y miembros de la comunidad universitaria para compartir nuestra experiencia en el sector de la movilidad eléctrica y promover conversaciones en torno a la sostenibilidad.

Durante la actividad, realizamos una activación informativa donde los asistentes pudieron conocer más acerca de GreenLine, nuestras tiendas, los beneficios vigentes para la comunidad UPN y las distintas soluciones de movilidad que forman parte de nuestro catálogo. Además, compartimos material informativo sobre nuestros vehículos eléctricos y la presencia que hemos construido en distintas ciudades del país.

La ponencia abordó temas relacionados con el crecimiento de GreenLine desde sus inicios, nuestra expansión en Perú y Chile, y el papel que la movilidad eléctrica desempeña actualmente dentro de las alternativas de transporte sostenible. También presentamos las diferentes categorías de vehículos que ofrecemos, entre ellas bicicletas eléctricas, VMP, motos eléctricas, trimotos y vehículos cargueros, explicando las características generales de cada una y los distintos escenarios de uso para los que han sido diseñados.

Asimismo, dedicamos un espacio a resolver algunas de las consultas más frecuentes que suelen surgir alrededor de la movilidad eléctrica, como la documentación requerida para determinados vehículos, los tipos de baterías disponibles y los factores que pueden influir en la elección de una solución de movilidad según las necesidades de cada usuario.

Uno de los momentos más destacados de la jornada fue la dinámica de preguntas y respuestas realizada con los estudiantes. A través de una participación activa y diversas actividades, los asistentes pudieron poner a prueba los conocimientos adquiridos durante la charla y acceder a distintos premios preparados para la ocasión. Este intercambio permitió generar una conversación cercana y enriquecedora sobre los retos y oportunidades que presenta la movilidad eléctrica.

En GreenLine, valoramos este tipo de espacios porque nos permiten compartir conocimiento, escuchar nuevas perspectivas y acercar la movilidad eléctrica a más personas.

Seguiremos impulsando iniciativas junto a instituciones educativas y comunidades que, al igual que nosotros, buscan contribuir a un futuro más sostenible a través de la innovación y la educación.',
        NULL,
        NULL,
        '2026-06-08',
        FALSE,
        TRUE,
        1),
('00000000-0000-0000-0000-000000000004',
        'GreenLine y UPN impulsan una movilidad más sostenible',
        'greenline-y-upn-impulsan-una-movilidad-mas-sostenible',
        'A. Yeren',
        'La movilidad eléctrica continúa generando nuevas oportunidades de acceso para distintos sectores y comunidades. Como parte de ello, mantenemos vigente nuestro convenio con la Universidad Privada del Norte, un beneficio dirigido a estudiantes, egresados y toda la comunidad UPN que desee acceder a nuestras soluciones de movilidad eléctrica con beneficios especiales.',
        '<h2>GreenLine y la comunidad UPN: más beneficios para la movilidad eléctrica</h2>
<p>La movilidad eléctrica continúa generando nuevas oportunidades de acceso para distintos sectores y comunidades. Como parte de ello, mantenemos vigente nuestro convenio con la Universidad Privada del Norte, un beneficio dirigido a estudiantes, egresados y toda la comunidad UPN que desee acceder a nuestras soluciones de movilidad eléctrica con beneficios especiales.</p>
<p>El beneficio se encuentra disponible en nuestras tiendas oficiales de: Surco, La Molina, San Miguel, Lince, Comas, Ate y Miraflores, donde los estudiantes, egresados y toda la comunidad UPN pueden acceder a descuentos exclusivos en vehículos eléctricos GreenLine. Este convenio vigente busca acercar alternativas de transporte prácticas y eficientes para distintos estilos de uso diario. Para acceder a la promoción, los usuarios deberán identificarse presentando su ID card virtual, credencial o algún medio de verificación que confirme su vínculo con la comunidad UPN, además del código promocional correspondiente en tienda.</p>
<p>En GreenLine, buscamos que cada vez más personas puedan acercarse a nuevas alternativas de movilidad a través de beneficios que se adapten a sus necesidades y estilo de vida. Este tipo de convenios nos permite seguir construyendo conexiones con distintas comunidades que, al igual que nosotros, comparten una visión orientada hacia un futuro más sostenible. Junto a la comunidad UPN, continuamos impulsando una movilidad eléctrica más cercana, accesible y pensada para el día a día.</p>',
        'GreenLine y la comunidad UPN: más beneficios para la movilidad eléctrica

La movilidad eléctrica continúa generando nuevas oportunidades de acceso para distintos sectores y comunidades. Como parte de ello, mantenemos vigente nuestro convenio con la Universidad Privada del Norte, un beneficio dirigido a estudiantes, egresados y toda la comunidad UPN que desee acceder a nuestras soluciones de movilidad eléctrica con beneficios especiales.

El beneficio se encuentra disponible en nuestras tiendas oficiales de: Surco, La Molina, San Miguel, Lince, Comas, Ate y Miraflores, donde los estudiantes, egresados y toda la comunidad UPN pueden acceder a descuentos exclusivos en vehículos eléctricos GreenLine. Este convenio vigente busca acercar alternativas de transporte prácticas y eficientes para distintos estilos de uso diario. Para acceder a la promoción, los usuarios deberán identificarse presentando su ID card virtual, credencial o algún medio de verificación que confirme su vínculo con la comunidad UPN, además del código promocional correspondiente en tienda.

En GreenLine, buscamos que cada vez más personas puedan acercarse a nuevas alternativas de movilidad a través de beneficios que se adapten a sus necesidades y estilo de vida. Este tipo de convenios nos permite seguir construyendo conexiones con distintas comunidades que, al igual que nosotros, comparten una visión orientada hacia un futuro más sostenible. Junto a la comunidad UPN, continuamos impulsando una movilidad eléctrica más cercana, accesible y pensada para el día a día.',
        NULL,
        NULL,
        '2026-05-29',
        FALSE,
        TRUE,
        2),
('00000000-0000-0000-0000-000000000004',
        'Tu próximo vehículo eléctrico, más cerca',
        'tu-proximo-vehiculo-electrico-mas-cerca',
        'A. Yeren',
        'En GreenLine, entendemos que adquirir un vehículo representa una decisión importante, especialmente cuando se busca equilibrar movilidad, ahorro y planificación financiera. Por ello, mantenemos vigente nuestro convenio con BBVA Perú, una alianza pensada para brindar mayores facilidades a quienes buscan dar el paso hacia la movilidad eléctrica de manera más accesible y organizada.',
        '<h2>Facilidades para acceder a la movilidad eléctrica con GreenLine y BBVA Perú</h2>
<p>En GreenLine, entendemos que adquirir un vehículo representa una decisión importante, especialmente cuando se busca equilibrar movilidad, ahorro y planificación financiera. Por ello, mantenemos vigente nuestro convenio con BBVA Perú, una alianza pensada para brindar mayores facilidades a quienes buscan dar el paso hacia la movilidad eléctrica de manera más accesible y organizada.</p>
<p>Gracias a este beneficio, nuestros clientes pueden adquirir cualquier vehículo de la marca GreenLine en hasta 6 cuotas sin intereses en nuestras tiendas oficiales. Esta facilidad aplica a nuestras distintas soluciones de movilidad eléctrica, incluyendo VMP, motos, trimotos y vehículos cargueros, permitiendo que más personas puedan acceder a alternativas diseñadas para diferentes necesidades de transporte y trabajo diario.</p>
<p>En los últimos años, el interés por la movilidad eléctrica ha mostrado un crecimiento constante en distintos mercados debido a factores como el ahorro operativo, la eficiencia energética y la búsqueda de alternativas más sostenibles para el desplazamiento urbano. En ese contexto, las facilidades de financiamiento y pago se han convertido en un elemento importante para impulsar el acceso a este tipo de tecnologías.</p>
<p>Este tipo de alianzas nos permite seguir acercando soluciones que no solo responden a nuevas necesidades de movilidad, sino que también ayudan a facilitar la inversión en vehículos eléctricos para más personas. Además, representan una oportunidad para que más usuarios puedan evaluar opciones de transporte con costos operativos más predecibles frente a sistemas tradicionales de combustible.</p>
<p>En GreenLine, continuamos trabajando junto a aliados estratégicos para desarrollar beneficios que acompañen las decisiones de nuestros clientes y faciliten el acceso a nuevas formas de movilidad, buscando que la transición hacia soluciones eléctricas sea cada vez más cercana, práctica y accesible.</p>',
        'Facilidades para acceder a la movilidad eléctrica con GreenLine y BBVA Perú

En GreenLine, entendemos que adquirir un vehículo representa una decisión importante, especialmente cuando se busca equilibrar movilidad, ahorro y planificación financiera. Por ello, mantenemos vigente nuestro convenio con BBVA Perú, una alianza pensada para brindar mayores facilidades a quienes buscan dar el paso hacia la movilidad eléctrica de manera más accesible y organizada.

Gracias a este beneficio, nuestros clientes pueden adquirir cualquier vehículo de la marca GreenLine en hasta 6 cuotas sin intereses en nuestras tiendas oficiales. Esta facilidad aplica a nuestras distintas soluciones de movilidad eléctrica, incluyendo VMP, motos, trimotos y vehículos cargueros, permitiendo que más personas puedan acceder a alternativas diseñadas para diferentes necesidades de transporte y trabajo diario.

En los últimos años, el interés por la movilidad eléctrica ha mostrado un crecimiento constante en distintos mercados debido a factores como el ahorro operativo, la eficiencia energética y la búsqueda de alternativas más sostenibles para el desplazamiento urbano. En ese contexto, las facilidades de financiamiento y pago se han convertido en un elemento importante para impulsar el acceso a este tipo de tecnologías.

Este tipo de alianzas nos permite seguir acercando soluciones que no solo responden a nuevas necesidades de movilidad, sino que también ayudan a facilitar la inversión en vehículos eléctricos para más personas. Además, representan una oportunidad para que más usuarios puedan evaluar opciones de transporte con costos operativos más predecibles frente a sistemas tradicionales de combustible.

En GreenLine, continuamos trabajando junto a aliados estratégicos para desarrollar beneficios que acompañen las decisiones de nuestros clientes y faciliten el acceso a nuevas formas de movilidad, buscando que la transición hacia soluciones eléctricas sea cada vez más cercana, práctica y accesible.',
        NULL,
        NULL,
        '2026-05-27',
        FALSE,
        TRUE,
        3),
('00000000-0000-0000-0000-000000000004',
        'Integración GreenLine 2026',
        'integracion-greenline-2026',
        'A. Yeren',
        'En GreenLine creemos que el crecimiento de una empresa no solo se mide por los nuevos proyectos que desarrolla o por las metas que alcanza, sino también por la fortaleza de las personas que hacen posible cada uno de esos avances. Detrás de cada tienda, cada vehículo, cada atención al cliente y cada área de trabajo existe un equipo que, con compromiso y dedicación, contribuyen diariamente al desarrollo de nuestra empresa.',
        '<h2>Fortalecemos nuestro equipo para seguir creciendo juntos</h2>
<p>En GreenLine creemos que el crecimiento de una empresa no solo se mide por los nuevos proyectos que desarrolla o por las metas que alcanza, sino también por la fortaleza de las personas que hacen posible cada uno de esos avances. Detrás de cada tienda, cada vehículo, cada atención al cliente y cada área de trabajo existe un equipo que, con compromiso y dedicación, contribuyen diariamente al desarrollo de nuestra empresa.</p>
<p>Con ese propósito, el pasado sábado 4 de julio realizamos una jornada de integración dirigida a nuestros colaboradores. Este encuentro nos permitió compartir un espacio diferente al entorno laboral, donde pudimos conocernos mejor, fortalecer los vínculos entre las distintas áreas y reforzar valores como la colaboración, el respeto y el trabajo en equipo. A través de diversas dinámicas y actividades grupales, promovimos la comunicación, la confianza y la importancia de avanzar hacia un mismo objetivo.</p>
<p>Estas iniciativas forman parte de nuestro compromiso por seguir construyendo una cultura organizacional sólida, en la que cada integrante se sienta valorado y reconocido por el papel que desempeña. Estamos convencidos de que el trabajo coordinado entre todas las áreas es uno de los pilares que nos permite seguir creciendo, afrontar nuevos desafíos y ofrecer una mejor experiencia a quienes confían en GreenLine.</p>
<p>En GreenLine entendemos que una empresa está formada por mucho más que procesos o resultados. Son las personas quienes impulsan cada idea, cada proyecto y cada logro que alcanzamos. Por ello, continuaremos promoviendo espacios que fortalezcan el compañerismo, la integración y el sentido de pertenencia, porque sabemos que cuando un equipo crece unido, también lo hace la empresa y el impacto positivo que genera en quienes la rodean.</p>',
        'Fortalecemos nuestro equipo para seguir creciendo juntos

En GreenLine creemos que el crecimiento de una empresa no solo se mide por los nuevos proyectos que desarrolla o por las metas que alcanza, sino también por la fortaleza de las personas que hacen posible cada uno de esos avances. Detrás de cada tienda, cada vehículo, cada atención al cliente y cada área de trabajo existe un equipo que, con compromiso y dedicación, contribuyen diariamente al desarrollo de nuestra empresa.

Con ese propósito, el pasado sábado 4 de julio realizamos una jornada de integración dirigida a nuestros colaboradores. Este encuentro nos permitió compartir un espacio diferente al entorno laboral, donde pudimos conocernos mejor, fortalecer los vínculos entre las distintas áreas y reforzar valores como la colaboración, el respeto y el trabajo en equipo. A través de diversas dinámicas y actividades grupales, promovimos la comunicación, la confianza y la importancia de avanzar hacia un mismo objetivo.

Estas iniciativas forman parte de nuestro compromiso por seguir construyendo una cultura organizacional sólida, en la que cada integrante se sienta valorado y reconocido por el papel que desempeña. Estamos convencidos de que el trabajo coordinado entre todas las áreas es uno de los pilares que nos permite seguir creciendo, afrontar nuevos desafíos y ofrecer una mejor experiencia a quienes confían en GreenLine.

En GreenLine entendemos que una empresa está formada por mucho más que procesos o resultados. Son las personas quienes impulsan cada idea, cada proyecto y cada logro que alcanzamos. Por ello, continuaremos promoviendo espacios que fortalezcan el compañerismo, la integración y el sentido de pertenencia, porque sabemos que cuando un equipo crece unido, también lo hace la empresa y el impacto positivo que genera en quienes la rodean.',
        NULL,
        NULL,
        '2026-07-10',
        FALSE,
        TRUE,
        4),
('00000000-0000-0000-0000-000000000004',
        'UN PAÍS QUE AVANZA EN CONJUNTO',
        'un-pais-que-avanza-en-conjunto',
        'A. Yeren',
        'Cada vez que el fútbol reúne a millones de personas frente a una cancha, recordamos que un gran resultado nunca depende de un solo jugador. Detrás de cada partido hay trabajo en equipo, compromiso, disciplina y personas que, desde diferentes roles, aportan para alcanzar un mismo objetivo. Esa misma idea también forma parte del día a día de nuestro país. En el Perú, millones de personas salen cada mañana para estudiar, emprender, trabajar o hacer crecer un proyecto. Aunque cada historia es distinta, todas comparten el mismo deseo de seguir avanzando y construir un mejor futuro.',
        '<h2>Un país avanza cuando todos jugamos para el mismo lado</h2>
<p>Cada vez que el fútbol reúne a millones de personas frente a una cancha, recordamos que un gran resultado nunca depende de un solo jugador. Detrás de cada partido hay trabajo en equipo, compromiso, disciplina y personas que, desde diferentes roles, aportan para alcanzar un mismo objetivo. Esa misma idea también forma parte del día a día de nuestro país. En el Perú, millones de personas salen cada mañana para estudiar, emprender, trabajar o hacer crecer un proyecto. Aunque cada historia es distinta, todas comparten el mismo deseo de seguir avanzando y construir un mejor futuro.</p>
<p>La movilidad también cumple un papel importante en ese camino. Más que trasladarnos de un lugar a otro, nos acerca a nuevas oportunidades y facilita que podamos desarrollar nuestras actividades diarias. El Banco Mundial señala que un transporte accesible y eficiente favorece el desarrollo económico y social al conectar a las personas con el empleo, la educación y distintos servicios. Al mismo tiempo, la Agencia Internacional de Energía destaca que la movilidad eléctrica continúa creciendo a nivel mundial como parte de la transición hacia sistemas de transporte más eficientes y sostenibles.</p>
<p>Al igual que en un equipo de fútbol, donde cada jugador aporta para alcanzar una meta común, el crecimiento de un país también depende del esfuerzo de quienes lo construyen todos los días. Cada estudiante que persigue una carrera, cada emprendedor que apuesta por su negocio y cada trabajador que sale con un propósito contribuyen, desde su lugar, al desarrollo del Perú. Detrás de cada recorrido hay una historia de esfuerzo, constancia y superación.</p>
<p>En GreenLine creemos que la movilidad cobra verdadero sentido cuando acompaña esos sueños y acerca a las personas a sus objetivos.</p>
<p>Más allá de desarrollar vehículos eléctricos, buscamos formar parte del camino de quienes impulsan el crecimiento del país con su trabajo, sus ideas y su dedicación. Porque, así como en el fútbol, estamos convencidos de que los grandes logros se alcanzan cuando todos jugamos para el mismo lado: el de un Perú que nunca deja de avanzar.</p>',
        'Un país avanza cuando todos jugamos para el mismo lado

Cada vez que el fútbol reúne a millones de personas frente a una cancha, recordamos que un gran resultado nunca depende de un solo jugador. Detrás de cada partido hay trabajo en equipo, compromiso, disciplina y personas que, desde diferentes roles, aportan para alcanzar un mismo objetivo. Esa misma idea también forma parte del día a día de nuestro país. En el Perú, millones de personas salen cada mañana para estudiar, emprender, trabajar o hacer crecer un proyecto. Aunque cada historia es distinta, todas comparten el mismo deseo de seguir avanzando y construir un mejor futuro.

La movilidad también cumple un papel importante en ese camino. Más que trasladarnos de un lugar a otro, nos acerca a nuevas oportunidades y facilita que podamos desarrollar nuestras actividades diarias. El Banco Mundial señala que un transporte accesible y eficiente favorece el desarrollo económico y social al conectar a las personas con el empleo, la educación y distintos servicios. Al mismo tiempo, la Agencia Internacional de Energía destaca que la movilidad eléctrica continúa creciendo a nivel mundial como parte de la transición hacia sistemas de transporte más eficientes y sostenibles.

Al igual que en un equipo de fútbol, donde cada jugador aporta para alcanzar una meta común, el crecimiento de un país también depende del esfuerzo de quienes lo construyen todos los días. Cada estudiante que persigue una carrera, cada emprendedor que apuesta por su negocio y cada trabajador que sale con un propósito contribuyen, desde su lugar, al desarrollo del Perú. Detrás de cada recorrido hay una historia de esfuerzo, constancia y superación.

En GreenLine creemos que la movilidad cobra verdadero sentido cuando acompaña esos sueños y acerca a las personas a sus objetivos.

Más allá de desarrollar vehículos eléctricos, buscamos formar parte del camino de quienes impulsan el crecimiento del país con su trabajo, sus ideas y su dedicación. Porque, así como en el fútbol, estamos convencidos de que los grandes logros se alcanzan cuando todos jugamos para el mismo lado: el de un Perú que nunca deja de avanzar.',
        NULL,
        NULL,
        '2026-07-17',
        FALSE,
        TRUE,
        5),
('00000000-0000-0000-0000-000000000001',
        '¿RESISTENCIA A LA LLUVIA?',
        'resistencia-a-la-lluvia',
        'A. Yeren',
        'Una de las dudas más frecuentes entre quienes están considerando adquirir un vehículo eléctrico es si puede utilizarse con normalidad durante un día de lluvia. Al tratarse de un medio de transporte que funciona mediante componentes eléctricos, es común pensar que el contacto con el agua representa un riesgo inmediato. Sin embargo, la realidad es diferente.',
        '<h2>¿La lluvia puede dañar un vehículo eléctrico?</h2>
<p>Una de las dudas más frecuentes entre quienes están considerando adquirir un vehículo eléctrico es si puede utilizarse con normalidad durante un día de lluvia. Al tratarse de un medio de transporte que funciona mediante componentes eléctricos, es común pensar que el contacto con el agua representa un riesgo inmediato. Sin embargo, la realidad es diferente.</p>
<p>Los vehículos eléctricos modernos están diseñados para operar bajo condiciones habituales de lluvia. Componentes como la batería, el controlador y el motor cuentan con sistemas de protección que ayudan a evitar el ingreso de agua durante un uso normal. De acuerdo con la Society of Automotive Engineers, estos sistemas se desarrollan siguiendo estándares de seguridad que permiten un funcionamiento confiable en distintas condiciones ambientales. No obstante, el nivel de protección puede variar según el modelo y las especificaciones del fabricante.</p>
<p>Es importante diferenciar entre conducir bajo la lluvia y circular por zonas inundadas. Aunque un vehículo eléctrico pueda desplazarse con normalidad durante una lluvia moderada, atravesar calles con acumulaciones importantes de agua puede comprometer distintos componentes, tal como ocurriría con cualquier otro tipo de vehículo. Por ello, fabricantes y especialistas recomiendan evitar la inmersión parcial o total del vehículo y respetar siempre las indicaciones del manual de usuario.</p>
<h2>El grado de protección también es importante</h2>
<p>Muchos vehículos eléctricos incorporan un grado de protección conocido como IP (Ingress Protection), una clasificación internacional establecida por la Comisión Electrotécnica Internacional que indica el nivel de resistencia de determinados componentes frente al ingreso de polvo y agua. Cuanto mayor sea esta clasificación, mayor será la protección frente a agentes externos. Sin embargo, esta certificación no significa que el vehículo pueda utilizarse en cualquier condición de inundación o permanecer sumergido.</p>
<p>En GreenLine recomendamos utilizar nuestros vehículos respetando las condiciones de uso para las que fueron diseñados, realizar las revisiones periódicas y consultar siempre las especificaciones de cada modelo.</p>
<p>Resolver este tipo de dudas permite comprender mejor cómo funciona la movilidad eléctrica y utilizar cada vehículo de forma segura, eficiente y responsable.</p>',
        '¿La lluvia puede dañar un vehículo eléctrico?

Una de las dudas más frecuentes entre quienes están considerando adquirir un vehículo eléctrico es si puede utilizarse con normalidad durante un día de lluvia. Al tratarse de un medio de transporte que funciona mediante componentes eléctricos, es común pensar que el contacto con el agua representa un riesgo inmediato. Sin embargo, la realidad es diferente.

Los vehículos eléctricos modernos están diseñados para operar bajo condiciones habituales de lluvia. Componentes como la batería, el controlador y el motor cuentan con sistemas de protección que ayudan a evitar el ingreso de agua durante un uso normal. De acuerdo con la Society of Automotive Engineers, estos sistemas se desarrollan siguiendo estándares de seguridad que permiten un funcionamiento confiable en distintas condiciones ambientales. No obstante, el nivel de protección puede variar según el modelo y las especificaciones del fabricante.

Es importante diferenciar entre conducir bajo la lluvia y circular por zonas inundadas. Aunque un vehículo eléctrico pueda desplazarse con normalidad durante una lluvia moderada, atravesar calles con acumulaciones importantes de agua puede comprometer distintos componentes, tal como ocurriría con cualquier otro tipo de vehículo. Por ello, fabricantes y especialistas recomiendan evitar la inmersión parcial o total del vehículo y respetar siempre las indicaciones del manual de usuario.

El grado de protección también es importante

Muchos vehículos eléctricos incorporan un grado de protección conocido como IP (Ingress Protection), una clasificación internacional establecida por la Comisión Electrotécnica Internacional que indica el nivel de resistencia de determinados componentes frente al ingreso de polvo y agua. Cuanto mayor sea esta clasificación, mayor será la protección frente a agentes externos. Sin embargo, esta certificación no significa que el vehículo pueda utilizarse en cualquier condición de inundación o permanecer sumergido.

En GreenLine recomendamos utilizar nuestros vehículos respetando las condiciones de uso para las que fueron diseñados, realizar las revisiones periódicas y consultar siempre las especificaciones de cada modelo.

Resolver este tipo de dudas permite comprender mejor cómo funciona la movilidad eléctrica y utilizar cada vehículo de forma segura, eficiente y responsable.',
        NULL,
        NULL,
        '2026-07-24',
        FALSE,
        TRUE,
        6),
('00000000-0000-0000-0000-000000000003',
        'CUMBRE PERÚ SOSTENIBLE',
        'cumbre-peru-sostenible',
        'A. Yeren',
        'Del 23 al 25 de octubre participamos en la Cumbre Perú Sostenible 2025, realizada en el Parque de Exposiciones de Magdalena, un evento que reúne a organizaciones y empresas comprometidas con reducir la huella de carbono y promover soluciones frente a los desafíos ambientales del país. Nuestra presencia   reafirmó nuestro rol dentro del ecosistema de sostenibilidad en el Perú.',
        '<h2>Nuestra participación en la Cumbre Perú Sostenible 2025</h2>
<p>Del 23 al 25 de octubre participamos en la Cumbre Perú Sostenible 2025, realizada en el Parque de Exposiciones de Magdalena, un evento que reúne a organizaciones y empresas comprometidas con reducir la huella de carbono y promover soluciones frente a los desafíos ambientales del país. Nuestra presencia   reafirmó nuestro rol dentro del ecosistema de sostenibilidad en el Perú.</p>
<p>En esta edición representamos al sector de movilidad eléctrica propia de toda nuestra gama de vehículos, mostrando algunos de nuestros modelos y explicando cómo ayudan a disminuir las emisiones para avanzar hacia un transporte más limpio y accesible. De esta manera cada espacio de diálogo nos acerca a más personas interesadas en alternativas responsables con el medio ambiente.</p>
<p>Con ocho años de trayectoria en el Perú, seguimos impulsando la electro movilidad como una ruta viable y urgente para construir ciudades menos contaminadas. Desde 2017 hemos puesto en manos de miles de peruanos vehículos que no generan emisiones y que ofrecen una alternativa real frente a los retos ambientales actuales.</p>
<p>Participar en la Cumbre Perú Sostenible nos permitió conectar con empresas, instituciones y ciudadanos que comparten nuestra visión. En GreenLine seguimos trabajando para ampliar el acceso a la movilidad eléctrica y aportar activamente a un Perú más verde, innovador y consciente.</p>',
        'Nuestra participación en la Cumbre Perú Sostenible 2025

Del 23 al 25 de octubre participamos en la Cumbre Perú Sostenible 2025, realizada en el Parque de Exposiciones de Magdalena, un evento que reúne a organizaciones y empresas comprometidas con reducir la huella de carbono y promover soluciones frente a los desafíos ambientales del país. Nuestra presencia   reafirmó nuestro rol dentro del ecosistema de sostenibilidad en el Perú.

En esta edición representamos al sector de movilidad eléctrica propia de toda nuestra gama de vehículos, mostrando algunos de nuestros modelos y explicando cómo ayudan a disminuir las emisiones para avanzar hacia un transporte más limpio y accesible. De esta manera cada espacio de diálogo nos acerca a más personas interesadas en alternativas responsables con el medio ambiente.

Con ocho años de trayectoria en el Perú, seguimos impulsando la electro movilidad como una ruta viable y urgente para construir ciudades menos contaminadas. Desde 2017 hemos puesto en manos de miles de peruanos vehículos que no generan emisiones y que ofrecen una alternativa real frente a los retos ambientales actuales.

Participar en la Cumbre Perú Sostenible nos permitió conectar con empresas, instituciones y ciudadanos que comparten nuestra visión. En GreenLine seguimos trabajando para ampliar el acceso a la movilidad eléctrica y aportar activamente a un Perú más verde, innovador y consciente.',
        NULL,
        NULL,
        '2025-12-12',
        FALSE,
        TRUE,
        7),
('00000000-0000-0000-0000-000000000003',
        'Impacto ambiental',
        'impacto-ambiental',
        'A. Yeren',
        'En el Perú, el sector transporte representa aproximadamente el 14% de las emisiones nacionales de gases de efecto invernadero, según el Ministerio del Ambiente (MINAM). Esto significa que la forma en que nos movilizamos no solo influye en nuestra economía diaria, sino también en la calidad del aire que respiramos y en el aporte del país frente al cambio climático.',
        '<h2>Manejar un vehículo eléctrico es también una decisión ambiental</h2>
<p>En el Perú, el sector transporte representa aproximadamente el 14% de las emisiones nacionales de gases de efecto invernadero, según el Ministerio del Ambiente (MINAM). Esto significa que la forma en que nos movilizamos no solo influye en nuestra economía diaria, sino también en la calidad del aire que respiramos y en el aporte del país frente al cambio climático.</p>
<p>La transición hacia vehículos eléctricos ya está generando resultados concretos. De acuerdo con el informe Zero-Emission Vehicles Factbook 2023 de Bloomberg NEF, en 2023 su uso permitió evitar aproximadamente 112 millones de toneladas de CO₂ a nivel mundial. Esta cifra demuestra que avanzar hacia tecnologías más limpias no es una proyección lejana, sino una realidad que ya está marcando la diferencia.</p>
<p>Además, la International Energy Agency señala que la electrificación del transporte es un eje clave para alcanzar los objetivos climáticos establecidos en el Paris Agreement, lo que refuerza la importancia de acelerar este proceso a nivel local y global.</p>
<p>Optar por un vehículo eléctrico implica reducir emisiones directas, disminuir la contaminación en zonas urbanas y contribuir a un modelo de movilidad más sostenible.</p>
<p>En GreenLine entendemos que la movilidad no solo debe ser eficiente, sino también consciente. Impulsamos soluciones que integran innovación y responsabilidad ambiental, convencidos de que el futuro no se construye solo con tecnología, sino con decisiones que generan impacto.</p>',
        'Manejar un vehículo eléctrico es también una decisión ambiental

En el Perú, el sector transporte representa aproximadamente el 14% de las emisiones nacionales de gases de efecto invernadero, según el Ministerio del Ambiente (MINAM). Esto significa que la forma en que nos movilizamos no solo influye en nuestra economía diaria, sino también en la calidad del aire que respiramos y en el aporte del país frente al cambio climático.

La transición hacia vehículos eléctricos ya está generando resultados concretos. De acuerdo con el informe Zero-Emission Vehicles Factbook 2023 de Bloomberg NEF, en 2023 su uso permitió evitar aproximadamente 112 millones de toneladas de CO₂ a nivel mundial. Esta cifra demuestra que avanzar hacia tecnologías más limpias no es una proyección lejana, sino una realidad que ya está marcando la diferencia.

Además, la International Energy Agency señala que la electrificación del transporte es un eje clave para alcanzar los objetivos climáticos establecidos en el Paris Agreement, lo que refuerza la importancia de acelerar este proceso a nivel local y global.

Optar por un vehículo eléctrico implica reducir emisiones directas, disminuir la contaminación en zonas urbanas y contribuir a un modelo de movilidad más sostenible.

En GreenLine entendemos que la movilidad no solo debe ser eficiente, sino también consciente. Impulsamos soluciones que integran innovación y responsabilidad ambiental, convencidos de que el futuro no se construye solo con tecnología, sino con decisiones que generan impacto.',
        NULL,
        NULL,
        '2026-02-27',
        FALSE,
        TRUE,
        8),
('00000000-0000-0000-0000-000000000003',
        'Cuando el ruido y la contaminación se vuelven rutina',
        'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina',
        'A. Yeren',
        'En el Perú, convivir con el ruido constante del tráfico y la exposición a emisiones contaminantes se ha vuelto parte del día a día. Estas condiciones, que muchas veces pasan desapercibidas, tienen un impacto directo en la calidad de vida de las personas y en el entorno urbano.',
        '<h2>Cuando el ruido y la contaminación se vuelven rutina</h2>
<p>En el Perú, convivir con el ruido constante del tráfico y la exposición a emisiones contaminantes se ha vuelto parte del día a día. Estas condiciones, que muchas veces pasan desapercibidas, tienen un impacto directo en la calidad de vida de las personas y en el entorno urbano.</p>
<p>De acuerdo con información del Ministerio del Ambiente, el transporte es responsable de una parte significativa de la contaminación del aire en el país. Solo en Lima y Callao, el parque automotor genera alrededor del 58% de estas emisiones, lo que refleja la magnitud del impacto que tiene la movilidad tradicional en las principales ciudades. En contextos urbanos cada vez más exigentes, esta realidad no solo afecta el ambiente, sino también la salud y el bienestar de quienes se movilizan diariamente.</p>
<p>A este escenario se suma un aspecto que pocas veces se visibiliza: la exposición constante a gases contaminantes durante los traslados. Estar diariamente en contacto con estas emisiones no solo deteriora la calidad del aire, sino que también influye en el bienestar general, especialmente en ciudades con alta concentración vehicular.</p>
<p>Sin embargo, hoy existen alternativas que permiten reducir este impacto sin detener la dinámica diaria. La movilidad eléctrica se presenta como una solución concreta, al eliminar emisiones directas durante su uso y ofrecer una forma más limpia y eficiente de desplazarse; en GreenLine, creemos que avanzar también implica cuestionar lo que damos por hecho, apostando por soluciones que no solo optimicen la forma en que nos movemos, sino que también contribuyan a construir entornos más saludables y sostenibles para todos.</p>',
        'Cuando el ruido y la contaminación se vuelven rutina

En el Perú, convivir con el ruido constante del tráfico y la exposición a emisiones contaminantes se ha vuelto parte del día a día. Estas condiciones, que muchas veces pasan desapercibidas, tienen un impacto directo en la calidad de vida de las personas y en el entorno urbano.

De acuerdo con información del Ministerio del Ambiente, el transporte es responsable de una parte significativa de la contaminación del aire en el país. Solo en Lima y Callao, el parque automotor genera alrededor del 58% de estas emisiones, lo que refleja la magnitud del impacto que tiene la movilidad tradicional en las principales ciudades. En contextos urbanos cada vez más exigentes, esta realidad no solo afecta el ambiente, sino también la salud y el bienestar de quienes se movilizan diariamente.

A este escenario se suma un aspecto que pocas veces se visibiliza: la exposición constante a gases contaminantes durante los traslados. Estar diariamente en contacto con estas emisiones no solo deteriora la calidad del aire, sino que también influye en el bienestar general, especialmente en ciudades con alta concentración vehicular.

Sin embargo, hoy existen alternativas que permiten reducir este impacto sin detener la dinámica diaria. La movilidad eléctrica se presenta como una solución concreta, al eliminar emisiones directas durante su uso y ofrecer una forma más limpia y eficiente de desplazarse; en GreenLine, creemos que avanzar también implica cuestionar lo que damos por hecho, apostando por soluciones que no solo optimicen la forma en que nos movemos, sino que también contribuyan a construir entornos más saludables y sostenibles para todos.',
        NULL,
        NULL,
        '2026-04-24',
        FALSE,
        TRUE,
        9),
('00000000-0000-0000-0000-000000000004',
        'GreenLine llega a Ate',
        'greenline-llega-a-ate',
        'A. Yeren',
        'En GreenLine, seguimos dando nuevos pasos para acercar la movilidad eléctrica a más personas. Este lunes 11 de mayo inauguramos oficialmente nuestra nueva tienda en Ate Vitarte, una apertura que representa nuestro compromiso por continuar creciendo y fortaleciendo nuestra presencia en distintos puntos de Lima.',
        '<h2>GREENLINE ATE YA ABRIÓ SUS PUERTAS</h2>
<p>En GreenLine, seguimos dando nuevos pasos para acercar la movilidad eléctrica a más personas. Este lunes 11 de mayo inauguramos oficialmente nuestra nueva tienda en Ate Vitarte, una apertura que representa nuestro compromiso por continuar creciendo y fortaleciendo nuestra presencia en distintos puntos de Lima.</p>
<p>Con esta nueva sede, buscamos brindar un espacio donde nuestros clientes puedan conocer de cerca nuestras soluciones de movilidad eléctrica y descubrir alternativas pensadas para diferentes necesidades de uso, trabajo y desplazamiento diario.</p>
<p>En nuestra tienda de Ate, quienes nos visiten podrán encontrar desde VMP y motos eléctricas hasta trimotos y vehículos cargueros, diseñados para responder a distintas dinámicas de movilidad. Durante el día de inauguración, compartimos este importante momento junto a las personas que nos acompañaron en la apertura y lanzamos un beneficio especial para quienes decidieron separar o adquirir uno de nuestros vehículos durante la jornada, como parte de nuestro agradecimiento por la confianza y el interés en nuestras soluciones eléctricas.</p>
<p>Cada nueva apertura representa una oportunidad para seguir construyendo una movilidad más cercana, práctica y accesible para más personas. En GreenLine, nos emociona seguir creciendo junto a ustedes y continuar construyendo una red de movilidad eléctrica cada vez más cercana. Y mientras seguimos avanzando, una pregunta continúa acompañándonos: ¿cuál será nuestro siguiente destino?</p>',
        'GREENLINE ATE YA ABRIÓ SUS PUERTAS

En GreenLine, seguimos dando nuevos pasos para acercar la movilidad eléctrica a más personas. Este lunes 11 de mayo inauguramos oficialmente nuestra nueva tienda en Ate Vitarte, una apertura que representa nuestro compromiso por continuar creciendo y fortaleciendo nuestra presencia en distintos puntos de Lima.

Con esta nueva sede, buscamos brindar un espacio donde nuestros clientes puedan conocer de cerca nuestras soluciones de movilidad eléctrica y descubrir alternativas pensadas para diferentes necesidades de uso, trabajo y desplazamiento diario.

En nuestra tienda de Ate, quienes nos visiten podrán encontrar desde VMP y motos eléctricas hasta trimotos y vehículos cargueros, diseñados para responder a distintas dinámicas de movilidad. Durante el día de inauguración, compartimos este importante momento junto a las personas que nos acompañaron en la apertura y lanzamos un beneficio especial para quienes decidieron separar o adquirir uno de nuestros vehículos durante la jornada, como parte de nuestro agradecimiento por la confianza y el interés en nuestras soluciones eléctricas.

Cada nueva apertura representa una oportunidad para seguir construyendo una movilidad más cercana, práctica y accesible para más personas. En GreenLine, nos emociona seguir creciendo junto a ustedes y continuar construyendo una red de movilidad eléctrica cada vez más cercana. Y mientras seguimos avanzando, una pregunta continúa acompañándonos: ¿cuál será nuestro siguiente destino?',
        NULL,
        NULL,
        '2026-05-15',
        FALSE,
        TRUE,
        10),
('00000000-0000-0000-0000-000000000003',
        'Logística que crece contigo',
        'logistica-que-crece-contigo',
        'A. Yeren',
        'A medida que un negocio crece, también lo hacen sus desafíos operativos; más pedidos, mayores volúmenes y rutas más exigentes demandan algo más que intención: requieren una capacidad real de respuesta que permita sostener el ritmo de la operación y garantizar la continuidad del servicio.',
        '<h2>Cuando tu negocio crece, tu logística también debe hacerlo</h2>
<p>A medida que un negocio crece, también lo hacen sus desafíos operativos; más pedidos, mayores volúmenes y rutas más exigentes demandan algo más que intención: requieren una capacidad real de respuesta que permita sostener el ritmo de la operación y garantizar la continuidad del servicio.</p>
<p>En muchos casos, las empresas continúan utilizando soluciones de movilidad pensadas para etapas iniciales de su desarrollo. Esto suele traducirse en más viajes para cubrir la misma demanda, un mayor desgaste operativo y una logística que comienza a quedarse atrás frente al crecimiento del negocio, afectando la eficiencia y la capacidad de cumplimiento.</p>
<p>Es en este contexto donde los vehículos de carga pesada adquieren un rol estratégico. No se trata únicamente de transportar más, sino de hacerlo de manera más eficiente: optimizando rutas,  reduciendo la cantidad de traslados y manteniendo la operación activa con mayor continuidad. Para lograrlo, este tipo de soluciones incorpora sistemas diseñados para el trabajo diario, con motores de alto rendimiento, autonomías que permiten cubrir jornadas completas y una capacidad de carga pensada para operaciones exigentes, facilitando el traslado de mayores volúmenes en menos recorridos.</p>
<p>En GreenLine, entendemos que crecer también implica adaptarse. Por ello, desarrollamos soluciones de movilidad eléctrica que acompañan esta evolución, con vehículos diseñados para responder a mayores exigencias  de carga sin perder eficiencia. Nuestro compromiso es ofrecer alternativas que permitan a los negocios escalar sus operaciones de manera sostenible y confiable.</p>
<p>Cuando la operación crece, la movilidad también debe hacerlo. En GreenLine, seguimos impulsando soluciones que acompañan el desarrollo de las empresas y contribuyen a una logística más eficiente y preparada para los desafíos actuales.</p>',
        'Cuando tu negocio crece, tu logística también debe hacerlo

A medida que un negocio crece, también lo hacen sus desafíos operativos; más pedidos, mayores volúmenes y rutas más exigentes demandan algo más que intención: requieren una capacidad real de respuesta que permita sostener el ritmo de la operación y garantizar la continuidad del servicio.

En muchos casos, las empresas continúan utilizando soluciones de movilidad pensadas para etapas iniciales de su desarrollo. Esto suele traducirse en más viajes para cubrir la misma demanda, un mayor desgaste operativo y una logística que comienza a quedarse atrás frente al crecimiento del negocio, afectando la eficiencia y la capacidad de cumplimiento.

Es en este contexto donde los vehículos de carga pesada adquieren un rol estratégico. No se trata únicamente de transportar más, sino de hacerlo de manera más eficiente: optimizando rutas,  reduciendo la cantidad de traslados y manteniendo la operación activa con mayor continuidad. Para lograrlo, este tipo de soluciones incorpora sistemas diseñados para el trabajo diario, con motores de alto rendimiento, autonomías que permiten cubrir jornadas completas y una capacidad de carga pensada para operaciones exigentes, facilitando el traslado de mayores volúmenes en menos recorridos.

En GreenLine, entendemos que crecer también implica adaptarse. Por ello, desarrollamos soluciones de movilidad eléctrica que acompañan esta evolución, con vehículos diseñados para responder a mayores exigencias  de carga sin perder eficiencia. Nuestro compromiso es ofrecer alternativas que permitan a los negocios escalar sus operaciones de manera sostenible y confiable.

Cuando la operación crece, la movilidad también debe hacerlo. En GreenLine, seguimos impulsando soluciones que acompañan el desarrollo de las empresas y contribuyen a una logística más eficiente y preparada para los desafíos actuales.',
        NULL,
        NULL,
        '2026-04-17',
        FALSE,
        TRUE,
        11),
('00000000-0000-0000-0000-000000000002',
        'MANTENIMIENTO PREVENTIVO VS CORRECTIVO',
        'mantenimiento-preventivo-vs-correctivo',
        'A. Yeren',
        'Cuando hablamos del cuidado de un vehículo eléctrico, es común escuchar términos como mantenimiento preventivo o mantenimiento correctivo. Aunque ambos forman parte de la vida útil de cualquier vehículo, cumplen funciones muy diferentes y entenderlas puede ayudar a evitar averías, prolongar el rendimiento de los componentes y reducir gastos innecesarios a largo plazo.',
        '<h2>Mantenimiento preventivo y correctivo ¿cuál necesita realmente tu vehículo eléctrico?</h2>
<p>Cuando hablamos del cuidado de un vehículo eléctrico, es común escuchar términos como mantenimiento preventivo o mantenimiento correctivo. Aunque ambos forman parte de la vida útil de cualquier vehículo, cumplen funciones muy diferentes y entenderlas puede ayudar a evitar averías, prolongar el rendimiento de los componentes y reducir gastos innecesarios a largo plazo.</p>
<h2>Antes de cualquier mantenimiento: la importancia de las revisiones</h2>
<p>Uno de los servicios más importantes para detectar posibles inconvenientes a tiempo son las revisiones periódicas. Durante estas evaluaciones se verifica la presión de las llantas, el funcionamiento de los frenos y el estado de la suspensión, elementos que influyen directamente en el desempeño y la seguridad del vehículo.</p>
<p>En GreenLine, los vehículos cuentan con dos revisiones gratuitas, las cuales permiten comprobar que los principales componentes se encuentren funcionando correctamente durante las primeras etapas de uso. Estas revisiones ayudan a identificar pequeños detalles antes de que se conviertan en problemas mayores y permiten realizar ajustes oportunos cuando sea necesario.</p>
<p>Una vez culminadas estas revisiones gratuitas, el siguiente paso para conservar el buen estado del vehículo es realizar los mantenimientos preventivos de manera periódica.</p>
<p>¿Qué es un mantenimiento preventivo?</p>
<p>Como su nombre lo indica, el mantenimiento preventivo tiene como objetivo prevenir el desgaste prematuro o posibles fallas en distintos componentes del vehículo.Este servicio puede incluir la calibración de llantas, lubricación de la suspensión, ajuste de piezas que hayan adquirido holgura con el uso, así como el desmontaje del tambor para realizar la limpieza de pastillas o zapatas de freno.</p>
<p>Estas acciones cumplen una función importante dentro del funcionamiento general del vehículo. Un mantenimiento preventivo realizado de forma periódica ayuda a que los distintos sistemas trabajen en condiciones adecuadas y reduce las probabilidades de que aparezcan fallas más complejas con el tiempo.</p>
<p>¿Qué es un mantenimiento correctivo?</p>
<p>A diferencia del mantenimiento preventivo, el mantenimiento correctivo se realiza cuando un componente ya presenta una avería o ha sufrido algún daño que requiere reparación o reemplazo. En estos casos, el trabajo no busca prevenir una falla, sino solucionar un problema existente para recuperar el funcionamiento normal del vehículo.</p>
<p>Muchas veces, los mantenimientos correctivos pueden estar relacionados con situaciones que pudieron detectarse previamente mediante revisiones o mantenimientos preventivos. Por ejemplo, una presión inadecuada en las llantas puede generar una mayor exigencia sobre determinados sistemas del vehículo. Si esta condición se mantiene durante mucho tiempo, puede ocasionar daños en componentes eléctricos como fusibles, controladores o llaves térmicas, derivando en reparaciones más complejas y costosas.</p>
<h2>La importancia de la prevención en el mantenimiento de tu vehículo eléctrico</h2>
<p>No todas las averías pueden evitarse, pero muchas de ellas pueden detectarse antes de convertirse en un problema mayor. Por ello, las revisiones periódicas y los mantenimientos preventivos cumplen un papel fundamental dentro del cuidado de cualquier vehículo eléctrico.</p>
<p>Más allá de mantener el vehículo en buen estado, estos servicios ayudan a preservar el rendimiento de sus componentes, optimizar su funcionamiento y brindar una experiencia de conducción más segura y confiable.</p>
<p>En muchos casos, una intervención preventiva puede evitar reparaciones correctivas que impliquen mayores costos, reemplazo de piezas o tiempos de inmovilización del vehículo. Por eso, más que un gasto, el mantenimiento preventivo debe entenderse como una inversión en la durabilidad y el desempeño del vehículo.</p>
<p>En GreenLine, promovemos una cultura de mantenimiento responsable porque entendemos que el cuidado adecuado de un vehículo no comienza cuando aparece una falla, sino mucho antes.</p>
<p>Por ello, ponemos a disposición de nuestros usuarios servicios de revisión y mantenimiento orientados a detectar posibles inconvenientes a tiempo y contribuir al buen funcionamiento del vehículo. Una revisión oportuna y un mantenimiento preventivo realizado de forma periódica pueden marcar la diferencia entre prevenir un problema y tener que repararlo.</p>',
        'Mantenimiento preventivo y correctivo ¿cuál necesita realmente tu vehículo eléctrico?

Cuando hablamos del cuidado de un vehículo eléctrico, es común escuchar términos como mantenimiento preventivo o mantenimiento correctivo. Aunque ambos forman parte de la vida útil de cualquier vehículo, cumplen funciones muy diferentes y entenderlas puede ayudar a evitar averías, prolongar el rendimiento de los componentes y reducir gastos innecesarios a largo plazo.

Antes de cualquier mantenimiento: la importancia de las revisiones

Uno de los servicios más importantes para detectar posibles inconvenientes a tiempo son las revisiones periódicas. Durante estas evaluaciones se verifica la presión de las llantas, el funcionamiento de los frenos y el estado de la suspensión, elementos que influyen directamente en el desempeño y la seguridad del vehículo.

En GreenLine, los vehículos cuentan con dos revisiones gratuitas, las cuales permiten comprobar que los principales componentes se encuentren funcionando correctamente durante las primeras etapas de uso. Estas revisiones ayudan a identificar pequeños detalles antes de que se conviertan en problemas mayores y permiten realizar ajustes oportunos cuando sea necesario.

Una vez culminadas estas revisiones gratuitas, el siguiente paso para conservar el buen estado del vehículo es realizar los mantenimientos preventivos de manera periódica.

¿Qué es un mantenimiento preventivo?

Como su nombre lo indica, el mantenimiento preventivo tiene como objetivo prevenir el desgaste prematuro o posibles fallas en distintos componentes del vehículo.Este servicio puede incluir la calibración de llantas, lubricación de la suspensión, ajuste de piezas que hayan adquirido holgura con el uso, así como el desmontaje del tambor para realizar la limpieza de pastillas o zapatas de freno.

Estas acciones cumplen una función importante dentro del funcionamiento general del vehículo. Un mantenimiento preventivo realizado de forma periódica ayuda a que los distintos sistemas trabajen en condiciones adecuadas y reduce las probabilidades de que aparezcan fallas más complejas con el tiempo.

¿Qué es un mantenimiento correctivo?

A diferencia del mantenimiento preventivo, el mantenimiento correctivo se realiza cuando un componente ya presenta una avería o ha sufrido algún daño que requiere reparación o reemplazo. En estos casos, el trabajo no busca prevenir una falla, sino solucionar un problema existente para recuperar el funcionamiento normal del vehículo.

Muchas veces, los mantenimientos correctivos pueden estar relacionados con situaciones que pudieron detectarse previamente mediante revisiones o mantenimientos preventivos. Por ejemplo, una presión inadecuada en las llantas puede generar una mayor exigencia sobre determinados sistemas del vehículo. Si esta condición se mantiene durante mucho tiempo, puede ocasionar daños en componentes eléctricos como fusibles, controladores o llaves térmicas, derivando en reparaciones más complejas y costosas.

La importancia de la prevención en el mantenimiento de tu vehículo eléctrico

No todas las averías pueden evitarse, pero muchas de ellas pueden detectarse antes de convertirse en un problema mayor. Por ello, las revisiones periódicas y los mantenimientos preventivos cumplen un papel fundamental dentro del cuidado de cualquier vehículo eléctrico.

Más allá de mantener el vehículo en buen estado, estos servicios ayudan a preservar el rendimiento de sus componentes, optimizar su funcionamiento y brindar una experiencia de conducción más segura y confiable.

En muchos casos, una intervención preventiva puede evitar reparaciones correctivas que impliquen mayores costos, reemplazo de piezas o tiempos de inmovilización del vehículo. Por eso, más que un gasto, el mantenimiento preventivo debe entenderse como una inversión en la durabilidad y el desempeño del vehículo.

En GreenLine, promovemos una cultura de mantenimiento responsable porque entendemos que el cuidado adecuado de un vehículo no comienza cuando aparece una falla, sino mucho antes.

Por ello, ponemos a disposición de nuestros usuarios servicios de revisión y mantenimiento orientados a detectar posibles inconvenientes a tiempo y contribuir al buen funcionamiento del vehículo. Una revisión oportuna y un mantenimiento preventivo realizado de forma periódica pueden marcar la diferencia entre prevenir un problema y tener que repararlo.',
        NULL,
        NULL,
        '2026-06-19',
        FALSE,
        TRUE,
        12),
('00000000-0000-0000-0000-000000000002',
        '¿Es importante respetar la capacidad de carga?',
        'es-importante-respetar-la-capacidad-de-carga',
        'A. Yeren',
        'Al momento de revisar la ficha técnica de un vehículo eléctrico, es común prestar atención a datos como la autonomía, la velocidad máxima o el tipo de batería. Sin embargo, existe una característica que muchas veces se subestima y que puede influir directamente en el desempeño del vehículo: la capacidad de carga.',
        '<h2>¿Por qué es importante respetar la capacidad de carga de un vehículo eléctrico?</h2>
<p>Al momento de revisar la ficha técnica de un vehículo eléctrico, es común prestar atención a datos como la autonomía, la velocidad máxima o el tipo de batería. Sin embargo, existe una característica que muchas veces se subestima y que puede influir directamente en el desempeño del vehículo: la capacidad de carga.</p>
<p>Este valor indica el peso máximo que el vehículo ha sido diseñado para transportar de manera segura y eficiente. Más allá de ser un dato técnico, representa un parámetro importante para garantizar que todos los componentes trabajen bajo las condiciones para las que fueron desarrollados.</p>
<h2>Más peso significa más exigencia</h2>
<p>Cuando un vehículo transporta una carga superior a la recomendada, distintos sistemas deben realizar un esfuerzo adicional para mantener su funcionamiento habitual. El motor necesita generar una mayor demanda de energía para movilizar el peso extra, mientras que la batería puede experimentar un consumo más acelerado durante el recorrido.</p>
<p>Como consecuencia, la autonomía puede verse reducida respecto a las cifras estimadas en condiciones normales de uso. Esto no significa necesariamente que exista una falla en el vehículo, sino que las condiciones de operación han cambiado debido al incremento de peso.</p>
<h2>La estabilidad también forma parte del rendimiento</h2>
<p>La capacidad de carga no solo está relacionada con la potencia o la autonomía. También influye en la estabilidad y el comportamiento general del vehículo durante la conducción.</p>
<p>Cuando el peso transportado supera los límites recomendados, la distribución de la carga puede afectar aspectos como la maniobrabilidad, la respuesta en curvas, la distancia de frenado e incluso el equilibrio del vehículo. Por ello, respetar los parámetros establecidos ayuda a mantener condiciones de conducción más seguras y predecibles.</p>
<h2>Un impacto en la vida útil de los componentes</h2>
<p>Los vehículos eléctricos están diseñados para operar dentro de determinados rangos de trabajo. Cuando estas condiciones se superan de forma constante, algunos componentes pueden verse sometidos a un desgaste prematuro.</p>
<p>Elementos como el sistema de suspensión, los neumáticos, los frenos y el propio sistema de tracción pueden experimentar mayores niveles de exigencia cuando el vehículo transporta más peso del recomendado de manera habitual. Con el tiempo, esto puede traducirse en una necesidad más frecuente de mantenimiento o reemplazo de componentes.</p>
<h2>No todos los vehículos están diseñados para la misma tarea</h2>
<p>Una de las razones por las que existen diferentes categorías de vehículos eléctricos es precisamente la variedad de necesidades de uso. Un vehículo de movilidad personal (VMP) no está pensado para cumplir la misma función que una moto eléctrica, una trimoto o un vehículo carguero.</p>
<p>Cada solución es desarrollada considerando factores como la capacidad de carga, el tipo de trayecto, el nivel de exigencia esperado y las características de uso más frecuentes. Por ello, elegir un vehículo adecuado para cada necesidad resulta tan importante como respetar los límites de carga establecidos por el fabricante.</p>
<h2>Un dato que merece más atención</h2>
<p>La capacidad de carga suele aparecer en la ficha técnica junto a muchas otras especificaciones, pero su importancia va mucho más allá de un simple número. Comprender este valor permite interpretar mejor el desempeño esperado del vehículo y contribuir a una experiencia de uso más eficiente, segura y duradera.</p>
<p>En GreenLine, buscamos brindar información que ayude a nuestros usuarios a conocer mejor sus vehículos y tomar decisiones informadas. Entender cómo influyen factores como la capacidad de carga es parte de una movilidad más responsable y de un mejor aprovechamiento de cada solución eléctrica.</p>',
        '¿Por qué es importante respetar la capacidad de carga de un vehículo eléctrico?

Al momento de revisar la ficha técnica de un vehículo eléctrico, es común prestar atención a datos como la autonomía, la velocidad máxima o el tipo de batería. Sin embargo, existe una característica que muchas veces se subestima y que puede influir directamente en el desempeño del vehículo: la capacidad de carga.

Este valor indica el peso máximo que el vehículo ha sido diseñado para transportar de manera segura y eficiente. Más allá de ser un dato técnico, representa un parámetro importante para garantizar que todos los componentes trabajen bajo las condiciones para las que fueron desarrollados.

Más peso significa más exigencia

Cuando un vehículo transporta una carga superior a la recomendada, distintos sistemas deben realizar un esfuerzo adicional para mantener su funcionamiento habitual. El motor necesita generar una mayor demanda de energía para movilizar el peso extra, mientras que la batería puede experimentar un consumo más acelerado durante el recorrido.

Como consecuencia, la autonomía puede verse reducida respecto a las cifras estimadas en condiciones normales de uso. Esto no significa necesariamente que exista una falla en el vehículo, sino que las condiciones de operación han cambiado debido al incremento de peso.

La estabilidad también forma parte del rendimiento

La capacidad de carga no solo está relacionada con la potencia o la autonomía. También influye en la estabilidad y el comportamiento general del vehículo durante la conducción.

Cuando el peso transportado supera los límites recomendados, la distribución de la carga puede afectar aspectos como la maniobrabilidad, la respuesta en curvas, la distancia de frenado e incluso el equilibrio del vehículo. Por ello, respetar los parámetros establecidos ayuda a mantener condiciones de conducción más seguras y predecibles.

Un impacto en la vida útil de los componentes

Los vehículos eléctricos están diseñados para operar dentro de determinados rangos de trabajo. Cuando estas condiciones se superan de forma constante, algunos componentes pueden verse sometidos a un desgaste prematuro.

Elementos como el sistema de suspensión, los neumáticos, los frenos y el propio sistema de tracción pueden experimentar mayores niveles de exigencia cuando el vehículo transporta más peso del recomendado de manera habitual. Con el tiempo, esto puede traducirse en una necesidad más frecuente de mantenimiento o reemplazo de componentes.

No todos los vehículos están diseñados para la misma tarea

Una de las razones por las que existen diferentes categorías de vehículos eléctricos es precisamente la variedad de necesidades de uso. Un vehículo de movilidad personal (VMP) no está pensado para cumplir la misma función que una moto eléctrica, una trimoto o un vehículo carguero.

Cada solución es desarrollada considerando factores como la capacidad de carga, el tipo de trayecto, el nivel de exigencia esperado y las características de uso más frecuentes. Por ello, elegir un vehículo adecuado para cada necesidad resulta tan importante como respetar los límites de carga establecidos por el fabricante.

Un dato que merece más atención

La capacidad de carga suele aparecer en la ficha técnica junto a muchas otras especificaciones, pero su importancia va mucho más allá de un simple número. Comprender este valor permite interpretar mejor el desempeño esperado del vehículo y contribuir a una experiencia de uso más eficiente, segura y duradera.

En GreenLine, buscamos brindar información que ayude a nuestros usuarios a conocer mejor sus vehículos y tomar decisiones informadas. Entender cómo influyen factores como la capacidad de carga es parte de una movilidad más responsable y de un mejor aprovechamiento de cada solución eléctrica.',
        NULL,
        NULL,
        '2026-06-17',
        FALSE,
        TRUE,
        13),
('00000000-0000-0000-0000-000000000001',
        '¿Cada cuánto debo cargar mi vehículo eléctrico?',
        'cada-cuanto-debo-cargar-mi-vehiculo-electrico',
        'A. Yeren',
        'Una de las preguntas más frecuentes que recibimos en GreenLine está relacionada con el cuidado de la batería: ¿cada cuánto debo cargar mi vehículo eléctrico? Aunque la respuesta puede variar según el uso y el tipo de vehículo, existen algunas recomendaciones generales que pueden ayudar a mantener un mejor rendimiento y prolongar la vida útil de la batería.',
        '<h2>¿Cada cuánto debo cargar mi GreenLine?</h2>
<p>Una de las preguntas más frecuentes que recibimos en GreenLine está relacionada con el cuidado de la batería: ¿cada cuánto debo cargar mi vehículo eléctrico? Aunque la respuesta puede variar según el uso y el tipo de vehículo, existen algunas recomendaciones generales que pueden ayudar a mantener un mejor rendimiento y prolongar la vida útil de la batería.</p>
<h2>No esperes a que la batería se descargue por completo</h2>
<p>Uno de los errores más comunes es esperar a que la batería llegue al mínimo nivel de carga antes de conectarla.</p>
<p>Nuestros especialistas de servicio técnico recomiendan realizar las cargas antes de que la batería se descargue por completo, ya que este hábito contribuye a una mejor conservación de sus componentes y ayuda a mantener un desempeño más estable a lo largo del tiempo.</p>
<h2>Respeta los tiempos de carga</h2>
<p>Cada vehículo cuenta con tiempos de carga específicos que pueden variar según la capacidad de la batería y el modelo.</p>
<p>Durante este proceso, es recomendable que el vehículo permanezca en reposo mientras se realiza la carga, ya sea que esta tome aproximadamente 4, 6 u 8 horas. Seguir estas recomendaciones permite que la energía se distribuya de manera adecuada y favorece el correcto funcionamiento del sistema.</p>
<p>¿Qué sucede si no voy a utilizar mi vehículo durante varios días?</p>
<p>Cuando un vehículo eléctrico permanece sin uso durante un periodo prolongado, la batería también requiere atención. En estos casos, recomendamos realizar una carga de mantenimiento al menos una vez por semana o encargar esta tarea a una persona de confianza si el propietario se encuentra de viaje.</p>
<p>Mantener una batería descargada durante largos periodos puede afectar progresivamente su capacidad de funcionamiento. Con el tiempo, esta situación puede generar una pérdida de rendimiento, reducir la vida útil de la batería e incluso ocasionar daños que podrían requerir una sustitución.</p>
<h2>Pequeños hábitos que hacen una gran diferencia</h2>
<p>El cuidado de una batería no depende únicamente de la tecnología que utiliza, sino también de los hábitos de uso y mantenimiento que se adopten día a día. Cargar el vehículo de manera adecuada, respetar los tiempos recomendados y evitar largos periodos de inactividad sin mantenimiento son acciones simples que pueden contribuir significativamente a preservar su rendimiento.</p>
<p>En GreenLine, buscamos acompañar a nuestros usuarios no solo durante la compra de un vehículo eléctrico, sino también brindando recomendaciones que les permitan aprovechar al máximo su inversión y disfrutar de una experiencia de movilidad más eficiente y duradera.</p>',
        '¿Cada cuánto debo cargar mi GreenLine?

Una de las preguntas más frecuentes que recibimos en GreenLine está relacionada con el cuidado de la batería: ¿cada cuánto debo cargar mi vehículo eléctrico? Aunque la respuesta puede variar según el uso y el tipo de vehículo, existen algunas recomendaciones generales que pueden ayudar a mantener un mejor rendimiento y prolongar la vida útil de la batería.

No esperes a que la batería se descargue por completo

Uno de los errores más comunes es esperar a que la batería llegue al mínimo nivel de carga antes de conectarla.

Nuestros especialistas de servicio técnico recomiendan realizar las cargas antes de que la batería se descargue por completo, ya que este hábito contribuye a una mejor conservación de sus componentes y ayuda a mantener un desempeño más estable a lo largo del tiempo.

Respeta los tiempos de carga

Cada vehículo cuenta con tiempos de carga específicos que pueden variar según la capacidad de la batería y el modelo.

Durante este proceso, es recomendable que el vehículo permanezca en reposo mientras se realiza la carga, ya sea que esta tome aproximadamente 4, 6 u 8 horas. Seguir estas recomendaciones permite que la energía se distribuya de manera adecuada y favorece el correcto funcionamiento del sistema.

¿Qué sucede si no voy a utilizar mi vehículo durante varios días?

Cuando un vehículo eléctrico permanece sin uso durante un periodo prolongado, la batería también requiere atención. En estos casos, recomendamos realizar una carga de mantenimiento al menos una vez por semana o encargar esta tarea a una persona de confianza si el propietario se encuentra de viaje.

Mantener una batería descargada durante largos periodos puede afectar progresivamente su capacidad de funcionamiento. Con el tiempo, esta situación puede generar una pérdida de rendimiento, reducir la vida útil de la batería e incluso ocasionar daños que podrían requerir una sustitución.

Pequeños hábitos que hacen una gran diferencia

El cuidado de una batería no depende únicamente de la tecnología que utiliza, sino también de los hábitos de uso y mantenimiento que se adopten día a día. Cargar el vehículo de manera adecuada, respetar los tiempos recomendados y evitar largos periodos de inactividad sin mantenimiento son acciones simples que pueden contribuir significativamente a preservar su rendimiento.

En GreenLine, buscamos acompañar a nuestros usuarios no solo durante la compra de un vehículo eléctrico, sino también brindando recomendaciones que les permitan aprovechar al máximo su inversión y disfrutar de una experiencia de movilidad más eficiente y duradera.',
        NULL,
        NULL,
        '2026-06-15',
        FALSE,
        TRUE,
        14),
('00000000-0000-0000-0000-000000000001',
        '¿Pueden subir pendientes?',
        'pueden-subir-pendientes',
        'A. Yeren',
        'Una de las consultas más frecuentes que recibimos en GreenLine es si un vehículo eléctrico puede subir pendientes con normalidad. Y aunque muchas veces la respuesta se relaciona únicamente con la potencia del motor, en la práctica existen otros factores igual de importantes que influyen directamente en el desempeño del vehículo frente a distintos niveles de inclinación.',
        '<h2>¿Todos los vehículos eléctricos pueden subir pendientes?</h2>
<p>Una de las consultas más frecuentes que recibimos en GreenLine es si un vehículo eléctrico puede subir pendientes con normalidad. Y aunque muchas veces la respuesta se relaciona únicamente con la potencia del motor, en la práctica existen otros factores igual de importantes que influyen directamente en el desempeño del vehículo frente a distintos niveles de inclinación.</p>
<p>La capacidad para subir pendientes no depende solo de “tener más motor”. Elementos como la potencia, el torque, el peso del vehículo, la capacidad de carga y el tipo de uso para el que fue diseñado forman parte del rendimiento general. De acuerdo con información técnica difundida por Bosch eBike Systems, el torque es uno de los factores más importantes en vehículos eléctricos al momento de afrontar inclinaciones, ya que influye directamente en la fuerza que el motor puede transmitir durante el arranque y la subida.</p>
<p>En vehículos más ligeros, como las VMP (Vehículos de Movilidad Personal), existe una capacidad de inclinación pensada para recorridos urbanos cotidianos y pendientes leves. Este tipo de soluciones prioriza la practicidad, ligereza y desplazamientos simples dentro de la ciudad. Sin embargo, a medida que la exigencia aumenta —ya sea por pendientes más pronunciadas, mayor peso o trayectos más extensos— el desempeño puede variar según la configuración del vehículo.</p>
<p>Por otro lado, en soluciones diseñadas para un uso más demandante, como motos eléctricas o algunos vehículos de carga, la respuesta suele ser más estable frente a inclinaciones moderadas. Esto se debe a que cuentan con configuraciones orientadas a soportar mayores niveles de exigencia, tanto en potencia como en capacidad operativa durante el recorrido. También es importante considerar que las pendientes no afectan únicamente la fuerza de subida, sino también el consumo energético.</p>
<p>Diversos estudios sobre movilidad eléctrica señalan que los recorridos con inclinación generan una mayor demanda de energía en comparación con trayectos planos, lo que puede influir directamente en la autonomía y desempeño general del vehículo durante el día.</p>
<p>En GreenLine, desarrollamos distintos tipos de soluciones eléctricas considerando estas variables, porque entendemos que cada necesidad de movilidad es diferente. Más que buscar un vehículo “para todo”, creemos en ofrecer alternativas diseñadas para responder de manera adecuada a distintos tipos de uso, recorridos y niveles de exigencia.</p>',
        '¿Todos los vehículos eléctricos pueden subir pendientes?

Una de las consultas más frecuentes que recibimos en GreenLine es si un vehículo eléctrico puede subir pendientes con normalidad. Y aunque muchas veces la respuesta se relaciona únicamente con la potencia del motor, en la práctica existen otros factores igual de importantes que influyen directamente en el desempeño del vehículo frente a distintos niveles de inclinación.

La capacidad para subir pendientes no depende solo de “tener más motor”. Elementos como la potencia, el torque, el peso del vehículo, la capacidad de carga y el tipo de uso para el que fue diseñado forman parte del rendimiento general. De acuerdo con información técnica difundida por Bosch eBike Systems, el torque es uno de los factores más importantes en vehículos eléctricos al momento de afrontar inclinaciones, ya que influye directamente en la fuerza que el motor puede transmitir durante el arranque y la subida.

En vehículos más ligeros, como las VMP (Vehículos de Movilidad Personal), existe una capacidad de inclinación pensada para recorridos urbanos cotidianos y pendientes leves. Este tipo de soluciones prioriza la practicidad, ligereza y desplazamientos simples dentro de la ciudad. Sin embargo, a medida que la exigencia aumenta —ya sea por pendientes más pronunciadas, mayor peso o trayectos más extensos— el desempeño puede variar según la configuración del vehículo.

Por otro lado, en soluciones diseñadas para un uso más demandante, como motos eléctricas o algunos vehículos de carga, la respuesta suele ser más estable frente a inclinaciones moderadas. Esto se debe a que cuentan con configuraciones orientadas a soportar mayores niveles de exigencia, tanto en potencia como en capacidad operativa durante el recorrido. También es importante considerar que las pendientes no afectan únicamente la fuerza de subida, sino también el consumo energético.

Diversos estudios sobre movilidad eléctrica señalan que los recorridos con inclinación generan una mayor demanda de energía en comparación con trayectos planos, lo que puede influir directamente en la autonomía y desempeño general del vehículo durante el día.

En GreenLine, desarrollamos distintos tipos de soluciones eléctricas considerando estas variables, porque entendemos que cada necesidad de movilidad es diferente. Más que buscar un vehículo “para todo”, creemos en ofrecer alternativas diseñadas para responder de manera adecuada a distintos tipos de uso, recorridos y niveles de exigencia.',
        NULL,
        NULL,
        '2026-05-22',
        FALSE,
        TRUE,
        15),
('00000000-0000-0000-0000-000000000001',
        '¿Cuánto cuesta cargar un vehículo eléctrico?',
        'cuanto-cuesta-cargar-un-vehiculo-electrico',
        'A. Yeren',
        'Uno de los mitos más comunes alrededor de la movilidad eléctrica es que cargar un vehículo puede generar un incremento elevado en el recibo de luz. Sin embargo, cuando se revisan los consumos reales y la capacidad energética de cada vehículo, el panorama cambia considerablemente.',
        '<h2>¿Es costoso cargar un vehículo eléctrico?</h2>
<p>Uno de los mitos más comunes alrededor de la movilidad eléctrica es que cargar un vehículo puede generar un incremento elevado en el recibo de luz. Sin embargo, cuando se revisan los consumos reales y la capacidad energética de cada vehículo, el panorama cambia considerablemente.</p>
<p>En GreenLine, realizamos cálculos tomando como referencia una tarifa promedio residencial de aproximadamente S/ 0.65 por kWh, valor cercano a las tarifas eléctricas reportadas por empresas distribuidoras de energía en el Perú. Bajo estas condiciones, el costo de una carga completa para uno de nuestros vehículos eléctricos puede oscilar entre S/ 0.37 y S/ 1.64, dependiendo del modelo, capacidad de batería y consumo energético del vehículo.</p>
<p>Esto significa que incluso en vehículos con baterías de mayor capacidad, el gasto por carga continúa siendo accesible frente a otros costos de movilidad presentes en el día a día. Además, a diferencia de los combustibles tradicionales, la energía eléctrica permite una estructura de consumo más estable y predecible, facilitando un mejor control de gastos para quienes utilizan el vehículo de manera frecuente.</p>
<p>También es importante considerar que el costo de carga puede variar según factores como el tipo de batería, la capacidad energética del vehículo, el tiempo de uso diario y la tarifa eléctrica contratada en cada hogar o negocio. Por ello, entender el consumo energético real de un vehículo eléctrico resulta clave para tomar decisiones más informadas y evaluar correctamente su impacto económico en el largo plazo.</p>
<p>De acuerdo con información del Organismo Supervisor de la Inversión en Energía y Minería (Osinergmin), las tarifas eléctricas residenciales en el Perú presentan variaciones según el consumo y la zona de distribución eléctrica, lo que influye directamente en el costo final de carga de cualquier vehículo eléctrico.</p>
<p>En GreenLine, impulsamos soluciones diseñadas para optimizar el rendimiento energético y facilitar una movilidad más eficiente para el día a día. Creemos que brindar información clara y transparente también forma parte de acompañar una transición real hacia alternativas de movilidad más accesibles, prácticas y sostenibles.</p>',
        '¿Es costoso cargar un vehículo eléctrico?

Uno de los mitos más comunes alrededor de la movilidad eléctrica es que cargar un vehículo puede generar un incremento elevado en el recibo de luz. Sin embargo, cuando se revisan los consumos reales y la capacidad energética de cada vehículo, el panorama cambia considerablemente.

En GreenLine, realizamos cálculos tomando como referencia una tarifa promedio residencial de aproximadamente S/ 0.65 por kWh, valor cercano a las tarifas eléctricas reportadas por empresas distribuidoras de energía en el Perú. Bajo estas condiciones, el costo de una carga completa para uno de nuestros vehículos eléctricos puede oscilar entre S/ 0.37 y S/ 1.64, dependiendo del modelo, capacidad de batería y consumo energético del vehículo.

Esto significa que incluso en vehículos con baterías de mayor capacidad, el gasto por carga continúa siendo accesible frente a otros costos de movilidad presentes en el día a día. Además, a diferencia de los combustibles tradicionales, la energía eléctrica permite una estructura de consumo más estable y predecible, facilitando un mejor control de gastos para quienes utilizan el vehículo de manera frecuente.

También es importante considerar que el costo de carga puede variar según factores como el tipo de batería, la capacidad energética del vehículo, el tiempo de uso diario y la tarifa eléctrica contratada en cada hogar o negocio. Por ello, entender el consumo energético real de un vehículo eléctrico resulta clave para tomar decisiones más informadas y evaluar correctamente su impacto económico en el largo plazo.

De acuerdo con información del Organismo Supervisor de la Inversión en Energía y Minería (Osinergmin), las tarifas eléctricas residenciales en el Perú presentan variaciones según el consumo y la zona de distribución eléctrica, lo que influye directamente en el costo final de carga de cualquier vehículo eléctrico.

En GreenLine, impulsamos soluciones diseñadas para optimizar el rendimiento energético y facilitar una movilidad más eficiente para el día a día. Creemos que brindar información clara y transparente también forma parte de acompañar una transición real hacia alternativas de movilidad más accesibles, prácticas y sostenibles.',
        NULL,
        NULL,
        '2026-05-20',
        FALSE,
        TRUE,
        16),
('00000000-0000-0000-0000-000000000001',
        '¿Cuál es la mejor batería?',
        'cual-es-la-mejor-bateria',
        'A. Yeren',
        'En la movilidad eléctrica, una de las ideas más comunes es pensar que existe una batería “mejor” que otra. Sin embargo, en la práctica, cada tecnología responde a necesidades distintas según el tipo de vehículo, el peso que soportará, las condiciones de uso y el nivel de exigencia diaria. Por ello, entender cómo funciona cada sistema resulta clave al momento de elegir un vehículo eléctrico.',
        '<h2>¿Todas las baterías funcionan igual en la movilidad eléctrica?</h2>
<p>En la movilidad eléctrica, una de las ideas más comunes es pensar que existe una batería “mejor” que otra. Sin embargo, en la práctica, cada tecnología responde a necesidades distintas según el tipo de vehículo, el peso que soportará, las condiciones de uso y el nivel de exigencia diaria. Por ello, entender cómo funciona cada sistema resulta clave al momento de elegir un vehículo eléctrico.</p>
<p>En GreenLine, trabajamos con distintas tecnologías porque entendemos que no todos los usuarios utilizan sus vehículos de la misma manera. Las baterías de plomo-ácido, por ejemplo, continúan siendo una base sólida dentro de la movilidad eléctrica debido a su estabilidad y resistencia en operaciones constantes, especialmente en vehículos que requieren soportar mayor peso o mantener un desempeño estable en trayectos diarios. De acuerdo con información técnica difundida por LiPower Group, este tipo de batería puede ofrecer una vida útil aproximada de entre 300 y 500 ciclos de carga, dependiendo de factores como el uso y mantenimiento del sistema.</p>
<p>Por otro lado, las baterías de plomo-grafeno representan una evolución dentro de esta misma línea, incorporando mejoras en eficiencia, rendimiento y duración frente a sistemas tradicionales de plomo. Este tipo de tecnología puede alcanzar entre 600 y 800 ciclos de carga, manteniendo una respuesta más eficiente en operaciones constantes y vehículos sometidos a mayores exigencias.</p>
<p>En el caso de las baterías de litio, su principal ventaja radica en la ligereza y practicidad. Este sistema reduce el peso total del vehículo y facilita la manipulación en modelos donde la extracción o el transporte de la batería forman parte del uso cotidiano. Además, según información publicada por Solfy, las baterías de litio pueden superar los 1,000 ciclos de carga y alcanzar varios años de vida útil dependiendo de la tecnología utilizada y sus condiciones de uso.</p>
<p>Más allá de centrarse en cuál tecnología es “mejor”, es importante analizar el conjunto de características que ofrece cada una. Algunas priorizan resistencia y estabilidad operativa; otras, practicidad y ligereza; mientras que algunas buscan un equilibrio entre ambos factores. En ese sentido, la diferencia no depende únicamente del tipo de batería, sino también de cómo se integra al vehículo y a las necesidades reales de uso.</p>
<p>En GreenLine, desarrollamos soluciones de movilidad considerando estas variables para ofrecer alternativas que respondan de manera adecuada a distintos estilos de conducción, exigencias de carga y dinámicas de movilidad. Comprender cómo funciona cada tecnología permite tomar decisiones más informadas y aprovechar mejor el rendimiento de cada vehículo eléctrico.</p>',
        '¿Todas las baterías funcionan igual en la movilidad eléctrica?

En la movilidad eléctrica, una de las ideas más comunes es pensar que existe una batería “mejor” que otra. Sin embargo, en la práctica, cada tecnología responde a necesidades distintas según el tipo de vehículo, el peso que soportará, las condiciones de uso y el nivel de exigencia diaria. Por ello, entender cómo funciona cada sistema resulta clave al momento de elegir un vehículo eléctrico.

En GreenLine, trabajamos con distintas tecnologías porque entendemos que no todos los usuarios utilizan sus vehículos de la misma manera. Las baterías de plomo-ácido, por ejemplo, continúan siendo una base sólida dentro de la movilidad eléctrica debido a su estabilidad y resistencia en operaciones constantes, especialmente en vehículos que requieren soportar mayor peso o mantener un desempeño estable en trayectos diarios. De acuerdo con información técnica difundida por LiPower Group, este tipo de batería puede ofrecer una vida útil aproximada de entre 300 y 500 ciclos de carga, dependiendo de factores como el uso y mantenimiento del sistema.

Por otro lado, las baterías de plomo-grafeno representan una evolución dentro de esta misma línea, incorporando mejoras en eficiencia, rendimiento y duración frente a sistemas tradicionales de plomo. Este tipo de tecnología puede alcanzar entre 600 y 800 ciclos de carga, manteniendo una respuesta más eficiente en operaciones constantes y vehículos sometidos a mayores exigencias.

En el caso de las baterías de litio, su principal ventaja radica en la ligereza y practicidad. Este sistema reduce el peso total del vehículo y facilita la manipulación en modelos donde la extracción o el transporte de la batería forman parte del uso cotidiano. Además, según información publicada por Solfy, las baterías de litio pueden superar los 1,000 ciclos de carga y alcanzar varios años de vida útil dependiendo de la tecnología utilizada y sus condiciones de uso.

Más allá de centrarse en cuál tecnología es “mejor”, es importante analizar el conjunto de características que ofrece cada una. Algunas priorizan resistencia y estabilidad operativa; otras, practicidad y ligereza; mientras que algunas buscan un equilibrio entre ambos factores. En ese sentido, la diferencia no depende únicamente del tipo de batería, sino también de cómo se integra al vehículo y a las necesidades reales de uso.

En GreenLine, desarrollamos soluciones de movilidad considerando estas variables para ofrecer alternativas que respondan de manera adecuada a distintos estilos de conducción, exigencias de carga y dinámicas de movilidad. Comprender cómo funciona cada tecnología permite tomar decisiones más informadas y aprovechar mejor el rendimiento de cada vehículo eléctrico.',
        NULL,
        NULL,
        '2026-05-08',
        FALSE,
        TRUE,
        17),
('00000000-0000-0000-0000-000000000001',
        '¿QUÉ TIPOS DE FRENO USAMOS?',
        'que-tipos-de-freno-usamos',
        'A. Yeren',
        'Cuando pensamos en los componentes más importantes de un vehículo eléctrico, solemos prestar atención a la batería, la autonomía o la potencia del motor. Sin embargo, existe otro sistema fundamental para la conducción: los frenos.',
        '<h2>¿Qué tipos de freno utilizan nuestros vehículos eléctricos?</h2>
<p>Cuando pensamos en los componentes más importantes de un vehículo eléctrico, solemos prestar atención a la batería, la autonomía o la potencia del motor. Sin embargo, existe otro sistema fundamental para la conducción: los frenos.</p>
<p>El sistema de frenado permite reducir la velocidad y detener el vehículo cuando es necesario, por lo que conocer cómo funciona y mantenerlo en buenas condiciones también forma parte del cuidado de nuestro vehículo.</p>
<p>En GreenLine contamos principalmente con dos sistemas de frenado: freno de disco y freno de tambor. Ambos tienen mecanismos diferentes, pero cumplen el mismo objetivo y pueden ofrecer un buen funcionamiento cuando corresponden al diseño del vehículo y reciben el mantenimiento adecuado.</p>
<h2>Freno de disco: un sistema de respuesta directa</h2>
<p>El freno de disco funciona mediante un disco que gira junto con la rueda y unas pastillas que ejercen presión sobre él cuando accionamos el freno. Esta fricción permite reducir progresivamente la velocidad hasta detener el vehículo.</p>
<p>Una de sus características es que se trata de un sistema de respuesta directa, cuyos componentes pueden revisarse para identificar señales de desgaste y determinar cuándo requieren mantenimiento o reemplazo.</p>
<p>Como cualquier sistema de frenado, su funcionamiento puede verse condicionado por el uso que recibe el vehículo. Por eso, no basta con contar con este tipo de freno: también es importante revisar periódicamente el estado de sus componentes.</p>
<h2>Freno de tambor: un sistema probado y funcional</h2>
<p>El freno de tambor utiliza un mecanismo diferente. En este caso, unas zapatas se desplazan hacia la superficie interna de un tambor que gira junto con la rueda. Al producirse el contacto entre ambos componentes, se genera la fricción necesaria para reducir la velocidad del vehículo.</p>
<p>Es un sistema ampliamente utilizado en diferentes tipos de vehículos y, al igual que el freno de disco, puede ofrecer un funcionamiento adecuado cuando se encuentra correctamente mantenido.</p>
<p>En este caso, el mantenimiento puede incluir la revisión y limpieza de componentes como las zapatas y el interior del tambor, dependiendo de las condiciones y necesidades del vehículo.</p>
<h2>Más importante que el tipo de freno es mantenerlo en buenas condiciones</h2>
<p>Al hablar de frenos, no se trata de determinar si el sistema de disco es mejor que el de tambor o viceversa. Cada sistema tiene sus propias características y puede ser adecuado para diferentes vehículos y condiciones de uso.</p>
<p>Lo realmente importante es que el sistema de frenado corresponda al diseño del vehículo y que sus componentes se encuentren en buenas condiciones. Por eso, recomendamos prestar atención a cualquier cambio en la respuesta del freno, realizar las revisiones correspondientes y cumplir con los mantenimientos preventivos indicados para cada vehículo.</p>
<p>En GreenLine, nuestras revisiones gratuitas incluyen una prueba de frenos, que permite comprobar su funcionamiento como parte de una evaluación general del vehículo. Además, durante los mantenimientos preventivos se pueden realizar trabajos relacionados con el sistema de frenado, como la revisión y limpieza de pastillas o zapatas, según corresponda.</p>
<p>Conocer qué sistema utiliza nuestro vehículo nos ayuda a entender mejor cómo funciona, pero mantenerlo correctamente es lo que permite conservar su funcionamiento en buenas condiciones a lo largo del tiempo.</p>
<p>En GreenLine creemos que una movilidad eléctrica también implica conocer y cuidar cada uno de los componentes que forman parte de nuestros vehículos.</p>',
        '¿Qué tipos de freno utilizan nuestros vehículos eléctricos?

Cuando pensamos en los componentes más importantes de un vehículo eléctrico, solemos prestar atención a la batería, la autonomía o la potencia del motor. Sin embargo, existe otro sistema fundamental para la conducción: los frenos.

El sistema de frenado permite reducir la velocidad y detener el vehículo cuando es necesario, por lo que conocer cómo funciona y mantenerlo en buenas condiciones también forma parte del cuidado de nuestro vehículo.

En GreenLine contamos principalmente con dos sistemas de frenado: freno de disco y freno de tambor. Ambos tienen mecanismos diferentes, pero cumplen el mismo objetivo y pueden ofrecer un buen funcionamiento cuando corresponden al diseño del vehículo y reciben el mantenimiento adecuado.

Freno de disco: un sistema de respuesta directa

El freno de disco funciona mediante un disco que gira junto con la rueda y unas pastillas que ejercen presión sobre él cuando accionamos el freno. Esta fricción permite reducir progresivamente la velocidad hasta detener el vehículo.

Una de sus características es que se trata de un sistema de respuesta directa, cuyos componentes pueden revisarse para identificar señales de desgaste y determinar cuándo requieren mantenimiento o reemplazo.

Como cualquier sistema de frenado, su funcionamiento puede verse condicionado por el uso que recibe el vehículo. Por eso, no basta con contar con este tipo de freno: también es importante revisar periódicamente el estado de sus componentes.

Freno de tambor: un sistema probado y funcional

El freno de tambor utiliza un mecanismo diferente. En este caso, unas zapatas se desplazan hacia la superficie interna de un tambor que gira junto con la rueda. Al producirse el contacto entre ambos componentes, se genera la fricción necesaria para reducir la velocidad del vehículo.

Es un sistema ampliamente utilizado en diferentes tipos de vehículos y, al igual que el freno de disco, puede ofrecer un funcionamiento adecuado cuando se encuentra correctamente mantenido.

En este caso, el mantenimiento puede incluir la revisión y limpieza de componentes como las zapatas y el interior del tambor, dependiendo de las condiciones y necesidades del vehículo.

Más importante que el tipo de freno es mantenerlo en buenas condiciones

Al hablar de frenos, no se trata de determinar si el sistema de disco es mejor que el de tambor o viceversa. Cada sistema tiene sus propias características y puede ser adecuado para diferentes vehículos y condiciones de uso.

Lo realmente importante es que el sistema de frenado corresponda al diseño del vehículo y que sus componentes se encuentren en buenas condiciones. Por eso, recomendamos prestar atención a cualquier cambio en la respuesta del freno, realizar las revisiones correspondientes y cumplir con los mantenimientos preventivos indicados para cada vehículo.

En GreenLine, nuestras revisiones gratuitas incluyen una prueba de frenos, que permite comprobar su funcionamiento como parte de una evaluación general del vehículo. Además, durante los mantenimientos preventivos se pueden realizar trabajos relacionados con el sistema de frenado, como la revisión y limpieza de pastillas o zapatas, según corresponda.

Conocer qué sistema utiliza nuestro vehículo nos ayuda a entender mejor cómo funciona, pero mantenerlo correctamente es lo que permite conservar su funcionamiento en buenas condiciones a lo largo del tiempo.

En GreenLine creemos que una movilidad eléctrica también implica conocer y cuidar cada uno de los componentes que forman parte de nuestros vehículos.',
        NULL,
        NULL,
        '2026-08-14',
        FALSE,
        TRUE,
        18),
('00000000-0000-0000-0000-000000000001',
        '¿CUÁNTO DE AUTONOMÍA NECESITA TU VEHÍCULO ELÉCTRICO?',
        'cuanto-de-autonomia-necesita-tu-vehiculo-electrico',
        'A. Yeren',
        'Cuando buscamos un vehículo eléctrico, uno de los primeros datos que solemos revisar es la autonomía. Es común pensar que un modelo con más kilómetros siempre será la mejor opción, pero antes de tomar una decisión vale la pena comprender qué significa realmente este valor y cómo puede ayudarte a elegir el vehículo adecuado para tu día a día.',
        '<h2>¿Cómo elegir la autonomía ideal para tu vehículo eléctrico?</h2>
<p>Cuando buscamos un vehículo eléctrico, uno de los primeros datos que solemos revisar es la autonomía. Es común pensar que un modelo con más kilómetros siempre será la mejor opción, pero antes de tomar una decisión vale la pena comprender qué significa realmente este valor y cómo puede ayudarte a elegir el vehículo adecuado para tu día a día.</p>
<p>¿Qué es la autonomía?</p>
<p>La autonomía es la distancia aproximada que un vehículo eléctrico puede recorrer con una carga completa de batería bajo determinadas condiciones de uso. Es uno de los principales indicadores que encontramos en la ficha técnica y nos permite tener una referencia de los recorridos que el vehículo puede realizar antes de necesitar una nueva carga.</p>
<p>Sin embargo, es importante recordar que la autonomía no representa una cifra fija. La Agencia Internacional de Energía señala que el rendimiento de un vehículo eléctrico puede variar según factores como el peso transportado, el tipo de recorrido, la velocidad de conducción y las condiciones de operación. Por ello, la autonomía debe entenderse como una referencia que puede cambiar dependiendo del uso que reciba el vehículo.</p>
<h2>No siempre necesitas la autonomía más alta</h2>
<p>Es común escuchar que 30, 40 o 50 kilómetros de autonomía parecen insuficientes. Sin embargo, cuando analizamos los recorridos cotidianos, descubrimos que esa distancia puede responder perfectamente a las necesidades de muchos usuarios.</p>
<p>Para una persona que utiliza el vehículo para ir al trabajo, asistir a clases, realizar compras o desplazarse dentro de la ciudad, una autonomía de 30 o 40 kilómetros puede cubrir su rutina diaria sin inconvenientes. Incluso, dependiendo de la distancia recorrida, una sola carga podría ser suficiente para más de un día de uso.</p>
<p>Por ello, la autonomía debe analizarse pensando en cómo nos movemos y no únicamente en el número que aparece en la ficha técnica.</p>
<h2>Cada tipo de vehículo responde a una necesidad diferente</h2>
<p>En GreenLine contamos con diferentes soluciones de movilidad porque entendemos que cada usuario tiene necesidades distintas. Las bicicletas eléctricas y bicimotos, con autonomías que van aproximadamente desde los 30 hasta los 40 kilómetros, son una excelente alternativa para quienes realizan recorridos urbanos de corta y media distancia. Son vehículos prácticos para trasladarse al trabajo, a la universidad o realizar actividades cotidianas sin recorrer grandes distancias.</p>
<p>Por otro lado, nuestras motos eléctricas ofrecen diferentes niveles de autonomía, desde opciones para recorridos diarios hasta modelos que alcanzan 90 kilómetros con una sola carga. Estas alternativas resultan ideales para quienes necesitan desplazarse por más tiempo durante la jornada, combinar distintas actividades o utilizar el vehículo como una herramienta de trabajo. Más que buscar el vehículo con la autonomía más alta, lo importante es elegir el que realmente responda a la forma en que te movilizas todos los días.</p>
<p>¿Cómo calcular la autonomía que realmente necesitas?</p>
<p>Una forma sencilla de elegir la autonomía adecuada es pensar en la distancia que recorres durante una jornada.</p>
<p>Si tu recorrido diario consiste en ir al trabajo y regresar a casa, asistir a clases o realizar actividades dentro de un mismo sector de la ciudad, probablemente una autonomía de 30 o 40 kilómetros sea suficiente para acompañarte en tu rutina.</p>
<p>Si además realizas varios desplazamientos durante el día o necesitas recorrer distancias mayores por motivos laborales, un vehículo con 60, 80 o hasta 90 kilómetros de autonomía puede brindarte un mayor margen para completar todas tus actividades con una sola carga.</p>
<p>Analizar tus recorridos habituales antes de comparar fichas técnicas te permitirá elegir una autonomía que realmente aproveches.</p>
<h2>Elegir bien también es entender cómo te mueves</h2>
<p>En GreenLine creemos que la mejor autonomía no es la que muestra el número más alto, sino la que responde a las necesidades reales de cada usuario.</p>
<p>Cada vehículo ha sido desarrollado para cumplir una función específica y acompañar diferentes estilos de vida. Comprender qué significa la autonomía y analizar nuestros recorridos diarios nos ayuda a tomar una decisión más informada, aprovechar mejor cada carga de batería y disfrutar una movilidad eléctrica pensada para nosotros.</p>',
        '¿Cómo elegir la autonomía ideal para tu vehículo eléctrico?

Cuando buscamos un vehículo eléctrico, uno de los primeros datos que solemos revisar es la autonomía. Es común pensar que un modelo con más kilómetros siempre será la mejor opción, pero antes de tomar una decisión vale la pena comprender qué significa realmente este valor y cómo puede ayudarte a elegir el vehículo adecuado para tu día a día.

¿Qué es la autonomía?

La autonomía es la distancia aproximada que un vehículo eléctrico puede recorrer con una carga completa de batería bajo determinadas condiciones de uso. Es uno de los principales indicadores que encontramos en la ficha técnica y nos permite tener una referencia de los recorridos que el vehículo puede realizar antes de necesitar una nueva carga.

Sin embargo, es importante recordar que la autonomía no representa una cifra fija. La Agencia Internacional de Energía señala que el rendimiento de un vehículo eléctrico puede variar según factores como el peso transportado, el tipo de recorrido, la velocidad de conducción y las condiciones de operación. Por ello, la autonomía debe entenderse como una referencia que puede cambiar dependiendo del uso que reciba el vehículo.

No siempre necesitas la autonomía más alta

Es común escuchar que 30, 40 o 50 kilómetros de autonomía parecen insuficientes. Sin embargo, cuando analizamos los recorridos cotidianos, descubrimos que esa distancia puede responder perfectamente a las necesidades de muchos usuarios.

Para una persona que utiliza el vehículo para ir al trabajo, asistir a clases, realizar compras o desplazarse dentro de la ciudad, una autonomía de 30 o 40 kilómetros puede cubrir su rutina diaria sin inconvenientes. Incluso, dependiendo de la distancia recorrida, una sola carga podría ser suficiente para más de un día de uso.

Por ello, la autonomía debe analizarse pensando en cómo nos movemos y no únicamente en el número que aparece en la ficha técnica.

Cada tipo de vehículo responde a una necesidad diferente

En GreenLine contamos con diferentes soluciones de movilidad porque entendemos que cada usuario tiene necesidades distintas. Las bicicletas eléctricas y bicimotos, con autonomías que van aproximadamente desde los 30 hasta los 40 kilómetros, son una excelente alternativa para quienes realizan recorridos urbanos de corta y media distancia. Son vehículos prácticos para trasladarse al trabajo, a la universidad o realizar actividades cotidianas sin recorrer grandes distancias.

Por otro lado, nuestras motos eléctricas ofrecen diferentes niveles de autonomía, desde opciones para recorridos diarios hasta modelos que alcanzan 90 kilómetros con una sola carga. Estas alternativas resultan ideales para quienes necesitan desplazarse por más tiempo durante la jornada, combinar distintas actividades o utilizar el vehículo como una herramienta de trabajo. Más que buscar el vehículo con la autonomía más alta, lo importante es elegir el que realmente responda a la forma en que te movilizas todos los días.

¿Cómo calcular la autonomía que realmente necesitas?

Una forma sencilla de elegir la autonomía adecuada es pensar en la distancia que recorres durante una jornada.

Si tu recorrido diario consiste en ir al trabajo y regresar a casa, asistir a clases o realizar actividades dentro de un mismo sector de la ciudad, probablemente una autonomía de 30 o 40 kilómetros sea suficiente para acompañarte en tu rutina.

Si además realizas varios desplazamientos durante el día o necesitas recorrer distancias mayores por motivos laborales, un vehículo con 60, 80 o hasta 90 kilómetros de autonomía puede brindarte un mayor margen para completar todas tus actividades con una sola carga.

Analizar tus recorridos habituales antes de comparar fichas técnicas te permitirá elegir una autonomía que realmente aproveches.

Elegir bien también es entender cómo te mueves

En GreenLine creemos que la mejor autonomía no es la que muestra el número más alto, sino la que responde a las necesidades reales de cada usuario.

Cada vehículo ha sido desarrollado para cumplir una función específica y acompañar diferentes estilos de vida. Comprender qué significa la autonomía y analizar nuestros recorridos diarios nos ayuda a tomar una decisión más informada, aprovechar mejor cada carga de batería y disfrutar una movilidad eléctrica pensada para nosotros.',
        NULL,
        NULL,
        '2026-08-07',
        FALSE,
        TRUE,
        19),
('00000000-0000-0000-0000-000000000001',
        '¿CUÁNTO DURA UN VEHÍCULO ELÉCTRICO?',
        'cuanto-dura-un-vehiculo-electrico',
        'A. Yeren',
        'Cuando hablamos de la vida útil de un vehículo eléctrico, es común pensar que todo depende de la batería. Sin embargo, la realidad es mucho más amplia. La duración de un vehículo está relacionada con el cuidado que recibe, el cumplimiento de los mantenimientos preventivos y los hábitos de uso que adoptamos desde el primer día. Al igual que ocurre con cualquier otro medio de transporte, un vehículo eléctrico está compuesto por distintos sistemas que trabajan en conjunto para ofrecer un desempeño seguro y eficiente.',
        '<h2>¿Qué hace que un vehículo eléctrico dure muchos años?</h2>
<p>Cuando hablamos de la vida útil de un vehículo eléctrico, es común pensar que todo depende de la batería. Sin embargo, la realidad es mucho más amplia. La duración de un vehículo está relacionada con el cuidado que recibe, el cumplimiento de los mantenimientos preventivos y los hábitos de uso que adoptamos desde el primer día. Al igual que ocurre con cualquier otro medio de transporte, un vehículo eléctrico está compuesto por distintos sistemas que trabajan en conjunto para ofrecer un desempeño seguro y eficiente.</p>
<h2>La importancia de la batería y sus tecnologías</h2>
<p>Uno de los componentes más importantes es la batería. Actualmente existen diferentes tecnologías, como las baterías de litio, plomo ácido y plomo grafeno, cada una con características, aplicaciones y tiempos de vida distintos. Esto no significa que una sea mejor que otra en todos los casos, sino que cada tecnología responde a diferentes necesidades de movilidad, niveles de exigencia y tipos de vehículo.</p>
<p>La Agencia Internacional de Energía señala que la constante evolución de las baterías ha sido clave para el desarrollo de la movilidad eléctrica, permitiendo ofrecer soluciones adaptadas a distintos usos y necesidades.</p>
<h2>Hábitos de uso que marcan la diferencia</h2>
<p>Más allá del tipo de batería, los hábitos de uso tienen un impacto directo en su rendimiento y durabilidad. Por ejemplo, respetar los tiempos de carga indicados por el fabricante y desconectar el cargador una vez que la batería alcanza el 100 % ayuda a preservar su funcionamiento.</p>
<p>Del mismo modo, dejar que la batería permanezca completamente descargada durante largos periodos puede afectar su desempeño e incluso dificultar su recuperación, especialmente si el vehículo no se utiliza con frecuencia. Cuando un vehículo permanecerá sin uso durante varios días o semanas, lo más recomendable es realizar cargas periódicas siguiendo las recomendaciones del fabricante para conservar la batería en buenas condiciones.</p>
<p>Las prácticas de mantenimiento preventivo son ampliamente recomendadas por organismos técnicos como IEEE para optimizar el desempeño y prolongar la vida útil de los sistemas de almacenamiento de energía.</p>
<h2>Carga, peso y mantenimiento del vehículo</h2>
<p>Otro aspecto que muchas veces pasa desapercibido es la capacidad de carga del vehículo. Transportar más peso del recomendado obliga al motor, la batería, la suspensión y otros componentes a trabajar con una mayor exigencia, lo que puede incrementar el desgaste con el paso del tiempo.</p>
<p>De igual manera, mantener la presión adecuada de las llantas y realizar los mantenimientos preventivos permite que todos los sistemas funcionen dentro de las condiciones para las que fueron diseñados. Estos pequeños cuidados, aunque simples, tienen un impacto directo en la eficiencia y durabilidad del vehículo.</p>
<h2>El ciclo de vida de la batería y el vehículo</h2>
<p>También es importante comprender que todas las baterías tienen una vida útil determinada. Con el paso de los años y de los ciclos de carga, su capacidad disminuye de manera gradual, lo cual forma parte de su funcionamiento normal.</p>
<p>Sin embargo, esto no significa que el vehículo haya llegado al final de su vida útil. Así como otros componentes pueden reemplazarse cuando cumplen su ciclo de servicio, una batería nueva permite que el vehículo continúe operando durante muchos años más, siempre que el resto de sus sistemas se mantenga en buenas condiciones.</p>
<h2>La visión de GreenLine sobre la durabilidad</h2>
<p>En GreenLine trabajamos con distintas tecnologías de baterías porque entendemos que cada usuario tiene necesidades diferentes y cada vehículo cumple una función específica.</p>
<p>Más allá de la tecnología que incorpore, creemos que la mejor forma de prolongar la vida útil de un vehículo eléctrico es combinar un producto de calidad con buenos hábitos de uso, mantenimiento oportuno y el respeto por las recomendaciones del fabricante.</p>
<p>De esta manera, nuestros usuarios pueden aprovechar al máximo el rendimiento de su vehículo y seguir disfrutando de una movilidad eficiente durante muchos años.</p>',
        '¿Qué hace que un vehículo eléctrico dure muchos años?

Cuando hablamos de la vida útil de un vehículo eléctrico, es común pensar que todo depende de la batería. Sin embargo, la realidad es mucho más amplia. La duración de un vehículo está relacionada con el cuidado que recibe, el cumplimiento de los mantenimientos preventivos y los hábitos de uso que adoptamos desde el primer día. Al igual que ocurre con cualquier otro medio de transporte, un vehículo eléctrico está compuesto por distintos sistemas que trabajan en conjunto para ofrecer un desempeño seguro y eficiente.

La importancia de la batería y sus tecnologías

Uno de los componentes más importantes es la batería. Actualmente existen diferentes tecnologías, como las baterías de litio, plomo ácido y plomo grafeno, cada una con características, aplicaciones y tiempos de vida distintos. Esto no significa que una sea mejor que otra en todos los casos, sino que cada tecnología responde a diferentes necesidades de movilidad, niveles de exigencia y tipos de vehículo.

La Agencia Internacional de Energía señala que la constante evolución de las baterías ha sido clave para el desarrollo de la movilidad eléctrica, permitiendo ofrecer soluciones adaptadas a distintos usos y necesidades.

Hábitos de uso que marcan la diferencia

Más allá del tipo de batería, los hábitos de uso tienen un impacto directo en su rendimiento y durabilidad. Por ejemplo, respetar los tiempos de carga indicados por el fabricante y desconectar el cargador una vez que la batería alcanza el 100 % ayuda a preservar su funcionamiento.

Del mismo modo, dejar que la batería permanezca completamente descargada durante largos periodos puede afectar su desempeño e incluso dificultar su recuperación, especialmente si el vehículo no se utiliza con frecuencia. Cuando un vehículo permanecerá sin uso durante varios días o semanas, lo más recomendable es realizar cargas periódicas siguiendo las recomendaciones del fabricante para conservar la batería en buenas condiciones.

Las prácticas de mantenimiento preventivo son ampliamente recomendadas por organismos técnicos como IEEE para optimizar el desempeño y prolongar la vida útil de los sistemas de almacenamiento de energía.

Carga, peso y mantenimiento del vehículo

Otro aspecto que muchas veces pasa desapercibido es la capacidad de carga del vehículo. Transportar más peso del recomendado obliga al motor, la batería, la suspensión y otros componentes a trabajar con una mayor exigencia, lo que puede incrementar el desgaste con el paso del tiempo.

De igual manera, mantener la presión adecuada de las llantas y realizar los mantenimientos preventivos permite que todos los sistemas funcionen dentro de las condiciones para las que fueron diseñados. Estos pequeños cuidados, aunque simples, tienen un impacto directo en la eficiencia y durabilidad del vehículo.

El ciclo de vida de la batería y el vehículo

También es importante comprender que todas las baterías tienen una vida útil determinada. Con el paso de los años y de los ciclos de carga, su capacidad disminuye de manera gradual, lo cual forma parte de su funcionamiento normal.

Sin embargo, esto no significa que el vehículo haya llegado al final de su vida útil. Así como otros componentes pueden reemplazarse cuando cumplen su ciclo de servicio, una batería nueva permite que el vehículo continúe operando durante muchos años más, siempre que el resto de sus sistemas se mantenga en buenas condiciones.

La visión de GreenLine sobre la durabilidad

En GreenLine trabajamos con distintas tecnologías de baterías porque entendemos que cada usuario tiene necesidades diferentes y cada vehículo cumple una función específica.

Más allá de la tecnología que incorpore, creemos que la mejor forma de prolongar la vida útil de un vehículo eléctrico es combinar un producto de calidad con buenos hábitos de uso, mantenimiento oportuno y el respeto por las recomendaciones del fabricante.

De esta manera, nuestros usuarios pueden aprovechar al máximo el rendimiento de su vehículo y seguir disfrutando de una movilidad eficiente durante muchos años.',
        NULL,
        NULL,
        '2026-07-31',
        FALSE,
        TRUE,
        20);

-- ============================================================
-- Artículos nuevos: Activaciones (categoría 00000000-0000-0000-0000-000000000005)
-- ============================================================
INSERT INTO greenline_posts (
    category_id,
    title,
    slug,
    author,
    excerpt,
    content_html,
    content_text,
    image_url,
    image_alt,
    published_at,
    featured,
    active,
    sort_order
) VALUES
(
    '00000000-0000-0000-0000-000000000005',
    'Bienvenida de Ciclo UPN x GreenLine',
    'bienvenida-de-ciclo-upn-x-grenline',
    'A. Yeren',
    'GreenLine compartió una experiencia de movilidad eléctrica junto a UPN Breña. El martes 18 de agosto formamos parte de la bienvenida de ciclo de la Universidad Privada del Norte (UPN), sede Breña.',
    '<h2>GreenLine compartió una experiencia de movilidad eléctrica junto a UPN Breña</h2>
<p>El martes 18 de agosto formamos parte de la bienvenida de ciclo de la Universidad Privada del Norte (UPN), sede Breña, donde compartimos con los estudiantes a través de diferentes actividades y dinámicas. Fue también nuestro primer acercamiento con esta sede, una oportunidad para presentar GreenLine y acercarles nuestras soluciones de movilidad eléctrica.</p>
<p>En esta ocasión, llevamos la S4PRO, una de nuestras nuevas VMP/bicimotos, para que los asistentes pudieran conocerla de cerca y conversar con nuestro equipo sobre sus características y posibilidades de uso. El modelo alcanza una velocidad de hasta 25 km/h y ofrece una autonomía de 40 a 50 kilómetros, características que la convierten en una alternativa para distintos recorridos urbanos.</p>
<p>El encuentro también incluyó juegos y dinámicas en los que los participantes pudieron poner a prueba sus conocimientos, divertirse y ganar premios. Esta actividad nos permitió generar conversaciones más cercanas y responder algunas de las principales preguntas de los jóvenes sobre movilidad eléctrica.</p>
<h3>Una alianza que busca generar valor</h3>
<p>Aprovechamos este espacio para reforzar la información sobre los beneficios exclusivos que tienen los integrantes de la UPN para adquirir vehículos GreenLine, como parte del convenio vigente entre ambas instituciones.</p>
<p>Para nosotros, esta alianza representa una oportunidad para acercar nuestras soluciones a nuevos públicos y generar experiencias que complementen los beneficios que ofrecemos a través de ella.</p>
<p>Estos encuentros también nos permiten conocer las inquietudes de los universitarios y compartir información que puede ser útil para sus necesidades de movilidad.</p>
<p>En GreenLine valoramos seguir construyendo este vínculo con la universidad y participar en espacios que nos permitan estar más cerca de sus estudiantes. Agradecemos a la sede UPN Breña por recibirnos y a todos los jóvenes que se acercaron, participaron en las actividades y se dieron el tiempo de conocer más sobre nuestra propuesta de movilidad eléctrica.</p>
<p>Continuamos trabajando para que nuestras alianzas no solo representen beneficios, sino también espacios de encuentro, información y nuevas experiencias alrededor de la movilidad eléctrica.</p>',
    'GreenLine compartió una experiencia de movilidad eléctrica junto a UPN Breña

El martes 18 de agosto formamos parte de la bienvenida de ciclo de la Universidad Privada del Norte (UPN), sede Breña, donde compartimos con los estudiantes a través de diferentes actividades y dinámicas. Fue también nuestro primer acercamiento con esta sede, una oportunidad para presentar GreenLine y acercarles nuestras soluciones de movilidad eléctrica.

En esta ocasión, llevamos la S4PRO, una de nuestras nuevas VMP/bicimotos, para que los asistentes pudieran conocerla de cerca y conversar con nuestro equipo sobre sus características y posibilidades de uso. El modelo alcanza una velocidad de hasta 25 km/h y ofrece una autonomía de 40 a 50 kilómetros, características que la convierten en una alternativa para distintos recorridos urbanos.

El encuentro también incluyó juegos y dinámicas en los que los participantes pudieron poner a prueba sus conocimientos, divertirse y ganar premios. Esta actividad nos permitió generar conversaciones más cercanas y responder algunas de las principales preguntas de los jóvenes sobre movilidad eléctrica.

Una alianza que busca generar valor

Aprovechamos este espacio para reforzar la información sobre los beneficios exclusivos que tienen los integrantes de la UPN para adquirir vehículos GreenLine, como parte del convenio vigente entre ambas instituciones.

Para nosotros, esta alianza representa una oportunidad para acercar nuestras soluciones a nuevos públicos y generar experiencias que complementen los beneficios que ofrecemos a través de ella.

Estos encuentros también nos permiten conocer las inquietudes de los universitarios y compartir información que puede ser útil para sus necesidades de movilidad.

En GreenLine valoramos seguir construyendo este vínculo con la universidad y participar en espacios que nos permitan estar más cerca de sus estudiantes. Agradecemos a la sede UPN Breña por recibirnos y a todos los jóvenes que se acercaron, participaron en las actividades y se dieron el tiempo de conocer más sobre nuestra propuesta de movilidad eléctrica.

Continuamos trabajando para que nuestras alianzas no solo representen beneficios, sino también espacios de encuentro, información y nuevas experiencias alrededor de la movilidad eléctrica.',
    'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/PORTADA-INICIO-DE-CICLO-UPN.webp',
    'Bienvenida de Ciclo UPN x GreenLine',
    '2026-08-21',
    FALSE,
    TRUE,
    21
),
(
    '00000000-0000-0000-0000-000000000005',
    'Delivery Urbano',
    'delivery-urbano',
    'A. Yeren',
    'Eficiencia, autonomía y el rol clave de la movilidad eléctrica. En el delivery urbano, cada kilómetro cuenta.',
    '<h2>Eficiencia, autonomía y el rol clave de la movilidad eléctrica</h2>
<p>En el delivery urbano, cada kilómetro cuenta. Hoy, la eficiencia de una operación no depende únicamente de la rapidez de una entrega, sino de la capacidad de un vehículo para cubrir múltiples rutas a lo largo de toda la jornada. En un contexto donde el tráfico y las distancias influyen directamente en los tiempos de traslado, la movilidad se convierte en un factor estratégico para repartidores, emprendedores y empresas que dependen del cumplimiento diario de sus servicios.</p>
<p>El crecimiento del delivery en el Perú refleja esta realidad. De acuerdo con información difundida por el portal Ser Peruano, este servicio puede llegar a incrementarse hasta en un 40% en temporadas de alta demanda, consolidando a la motocicleta como uno de los principales medios de distribución urbana. Sin embargo, este aumento también pone en evidencia desafíos importantes: mayor congestión, incremento de costos operativos y una fuerte dependencia de vehículos a combustible que impactan tanto en la rentabilidad como en el entorno.</p>
<p>En este escenario, factores como la autonomía del vehículo —es decir, la distancia que puede recorrer con una sola carga—, la continuidad del recorrido y el costo por trayecto adquieren un rol clave. Cada interrupción en la ruta, cada parada no planificada o cada gasto adicional en combustible puede traducirse en menos entregas completadas y menor eficiencia al cierre del día. Por eso, cada vez más negocios están priorizando soluciones que les permitan mantener una operación constante, predecible y optimizada.</p>
<p>La movilidad eléctrica empieza a posicionarse como una respuesta concreta a esta necesidad, no solo por eliminar emisiones directas durante su uso, sino también por reducir costos operativos y simplificar el mantenimiento, aspectos clave para quienes trabajan en logística urbana.</p>
<p>Esta evolución va de la mano con una tendencia creciente en el país: cada vez más personas apuestan por vehículos electrificados, reflejando un cambio progresivo en la forma de movilizarse. En ese contexto, en GreenLine desarrollamos motos eléctricas con autonomías de hasta 90 km por carga, pensadas para acompañar el ritmo real del delivery urbano y lograr recorridos más eficientes, continuos y rentables.</p>',
    'Eficiencia, autonomía y el rol clave de la movilidad eléctrica

En el delivery urbano, cada kilómetro cuenta. Hoy, la eficiencia de una operación no depende únicamente de la rapidez de una entrega, sino de la capacidad de un vehículo para cubrir múltiples rutas a lo largo de toda la jornada. En un contexto donde el tráfico y las distancias influyen directamente en los tiempos de traslado, la movilidad se convierte en un factor estratégico para repartidores, emprendedores y empresas que dependen del cumplimiento diario de sus servicios.

El crecimiento del delivery en el Perú refleja esta realidad. De acuerdo con información difundida por el portal Ser Peruano, este servicio puede llegar a incrementarse hasta en un 40% en temporadas de alta demanda, consolidando a la motocicleta como uno de los principales medios de distribución urbana. Sin embargo, este aumento también pone en evidencia desafíos importantes: mayor congestión, incremento de costos operativos y una fuerte dependencia de vehículos a combustible que impactan tanto en la rentabilidad como en el entorno.

En este escenario, factores como la autonomía del vehículo —es decir, la distancia que puede recorrer con una sola carga—, la continuidad del recorrido y el costo por trayecto adquieren un rol clave. Cada interrupción en la ruta, cada parada no planificada o cada gasto adicional en combustible puede traducirse en menos entregas completadas y menor eficiencia al cierre del día. Por eso, cada vez más negocios están priorizando soluciones que les permitan mantener una operación constante, predecible y optimizada.

La movilidad eléctrica empieza a posicionarse como una respuesta concreta a esta necesidad, no solo por eliminar emisiones directas durante su uso, sino también por reducir costos operativos y simplificar el mantenimiento, aspectos clave para quienes trabajan en logística urbana.

Esta evolución va de la mano con una tendencia creciente en el país: cada vez más personas apuestan por vehículos electrificados, reflejando un cambio progresivo en la forma de movilizarse. En ese contexto, en GreenLine desarrollamos motos eléctricas con autonomías de hasta 90 km por carga, pensadas para acompañar el ritmo real del delivery urbano y lograr recorridos más eficientes, continuos y rentables.',
    'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/delivery_autonomia/PORTADA-DE-DELIVERY.webp',
    'Delivery Urbano',
    '2026-03-27',
    FALSE,
    TRUE,
    22
),
(
    '00000000-0000-0000-0000-000000000005',
    'Nueva tienda GreenLine Comas',
    'nueva-tienda-comas',
    'A. Yeren',
    'Seguimos creciendo en Lima con nuestra nueva tienda en Comas. En GreenLine seguimos avanzando con un objetivo claro: acercar la movilidad eléctrica a más personas.',
    '<h2>Seguimos creciendo en Lima con nuestra nueva tienda en Comas</h2>
<p>En GreenLine seguimos avanzando con un objetivo claro: acercar la movilidad eléctrica a más personas. El pasado 27 de marzo inauguramos nuestra nueva tienda en Comas, un paso importante dentro de nuestro crecimiento en Lima y una muestra del interés cada vez mayor por alternativas de transporte más eficientes y accesibles.</p>
<p>La apertura de esta nueva sede nos permitió conectar directamente con la comunidad, recibiendo a personas interesadas en conocer de cerca nuestros vehículos eléctricos y sus beneficios en el uso diario. Durante la jornada, presentamos algunos de los modelos con mayor demanda, destacando por su rendimiento, practicidad y adaptación a distintas necesidades de movilidad, desde traslados personales hasta usos más operativos.</p>
<p>Esta inauguración también marcó el inicio de un beneficio exclusivo vigente durante todo el mes de abril, dirigido a quienes decidan dar el paso hacia la movilidad eléctrica con nosotros. A través de este tipo de iniciativas, buscamos no solo facilitar el acceso a nuestros vehículos, sino también acompañar el proceso de adopción con propuestas concretas.</p>
<p>Con la apertura en Comas, seguimos consolidando nuestra presencia en Lima y ampliando nuestra capacidad de atención en puntos estratégicos de la ciudad. Cada nueva tienda representa una oportunidad para estar más cerca, entender mejor las necesidades de quienes confían en nosotros y seguir impulsando una forma de movilidad que responde a los retos actuales.</p>
<p>En GreenLine, continuamos creciendo junto a nuestra comunidad, desarrollando soluciones que acompañan su día a día y fortaleciendo nuestra presencia en más zonas del país.</p>',
    'Seguimos creciendo en Lima con nuestra nueva tienda en Comas

En GreenLine seguimos avanzando con un objetivo claro: acercar la movilidad eléctrica a más personas. El pasado 27 de marzo inauguramos nuestra nueva tienda en Comas, un paso importante dentro de nuestro crecimiento en Lima y una muestra del interés cada vez mayor por alternativas de transporte más eficientes y accesibles.

La apertura de esta nueva sede nos permitió conectar directamente con la comunidad, recibiendo a personas interesadas en conocer de cerca nuestros vehículos eléctricos y sus beneficios en el uso diario. Durante la jornada, presentamos algunos de los modelos con mayor demanda, destacando por su rendimiento, practicidad y adaptación a distintas necesidades de movilidad, desde traslados personales hasta usos más operativos.

Esta inauguración también marcó el inicio de un beneficio exclusivo vigente durante todo el mes de abril, dirigido a quienes decidan dar el paso hacia la movilidad eléctrica con nosotros. A través de este tipo de iniciativas, buscamos no solo facilitar el acceso a nuestros vehículos, sino también acompañar el proceso de adopción con propuestas concretas.

Con la apertura en Comas, seguimos consolidando nuestra presencia en Lima y ampliando nuestra capacidad de atención en puntos estratégicos de la ciudad. Cada nueva tienda representa una oportunidad para estar más cerca, entender mejor las necesidades de quienes confían en nosotros y seguir impulsando una forma de movilidad que responde a los retos actuales.

En GreenLine, continuamos creciendo junto a nuestra comunidad, desarrollando soluciones que acompañan su día a día y fortaleciendo nuestra presencia en más zonas del país.',
    'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_comas/COMAS-1.webp',
    'Nueva tienda GreenLine Comas',
    '2026-04-30',
    FALSE,
    TRUE,
    23
),
(
    '00000000-0000-0000-0000-000000000005',
    'Nueva tienda GreenLine Huancayo',
    'nueva-tienda-huancayo',
    'A. Yeren',
    'Abrimos nuestra nueva tienda en Huancayo y continuamos creciendo en el Perú. GreenLine continúa fortaleciendo su presencia en el país.',
    '<h2>Abrimos nuestra nueva tienda en Huancayo y continuamos creciendo en el Perú</h2>
<p>GreenLine continúa fortaleciendo su presencia en el país con la apertura de su nueva tienda oficial en Huancayo, consolidando así su proceso de expansión en el sector de vehículos eléctricos. Con esta inauguración, la marca suma seis tiendas a nivel nacional, acercando sus soluciones a más personas interesadas en alternativas de transporte eficientes, accesibles y adaptadas a las necesidades del día a día.</p>
<p>Como parte de este hito, estuvimos en Huancayo del martes 10 al jueves 12, días en los que impulsamos la visibilidad de nuestra nueva tienda y acercamos nuestra propuesta a más personas. Durante ese tiempo, la tienda se convirtió en un espacio donde quienes nos visitaron pudieron conocer de cerca nuestros vehículos eléctricos, resolver dudas y descubrir cómo integrarlos en su día a día, en un contexto donde la demanda por soluciones de transporte más eficientes, accesibles y prácticas continúa creciendo, posicionando a Huancayo como un punto clave para seguir impulsando la electromovilidad fuera de la capital.</p>
<p>A medida que más peruanos buscan crecer, emprender y optimizar su día a día, la movilidad eléctrica se convierte en una herramienta clave para lograrlo. En ese camino, seguimos ampliando nuestro alcance no solo a través de tiendas oficiales, sino también mediante una red de distribuidores autorizados en distintas zonas del país, lo que nos permite estar más cerca de quienes necesitan soluciones prácticas y eficientes. Así, no solo acompañamos la evolución del transporte en el Perú, sino que también contribuimos a que más personas accedan a nuevas oportunidades a través de una movilidad pensada para su realidad.</p>',
    'Abrimos nuestra nueva tienda en Huancayo y continuamos creciendo en el Perú

GreenLine continúa fortaleciendo su presencia en el país con la apertura de su nueva tienda oficial en Huancayo, consolidando así su proceso de expansión en el sector de vehículos eléctricos. Con esta inauguración, la marca suma seis tiendas a nivel nacional, acercando sus soluciones a más personas interesadas en alternativas de transporte eficientes, accesibles y adaptadas a las necesidades del día a día.

Como parte de este hito, estuvimos en Huancayo del martes 10 al jueves 12, días en los que impulsamos la visibilidad de nuestra nueva tienda y acercamos nuestra propuesta a más personas. Durante ese tiempo, la tienda se convirtió en un espacio donde quienes nos visitaron pudieron conocer de cerca nuestros vehículos eléctricos, resolver dudas y descubrir cómo integrarlos en su día a día, en un contexto donde la demanda por soluciones de transporte más eficientes, accesibles y prácticas continúa creciendo, posicionando a Huancayo como un punto clave para seguir impulsando la electromovilidad fuera de la capital.

A medida que más peruanos buscan crecer, emprender y optimizar su día a día, la movilidad eléctrica se convierte en una herramienta clave para lograrlo. En ese camino, seguimos ampliando nuestro alcance no solo a través de tiendas oficiales, sino también mediante una red de distribuidores autorizados en distintas zonas del país, lo que nos permite estar más cerca de quienes necesitan soluciones prácticas y eficientes. Así, no solo acompañamos la evolución del transporte en el Perú, sino que también contribuimos a que más personas accedan a nuevas oportunidades a través de una movilidad pensada para su realidad.',
    'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_huancayo/PORTADA-GREEN-HUANCAYO.webp',
    'Nueva tienda GreenLine Huancayo',
    '2026-03-20',
    FALSE,
    TRUE,
    24
),
(
    '00000000-0000-0000-0000-000000000005',
    'GreenLine presente en la ExpoChina 2025',
    'expo-china-2025',
    'A. Yeren',
    'Del miércoles 29 de octubre al sábado 1 de noviembre, participamos en la ExpoChina 2025, realizada en el Centro de Exposiciones Jockey.',
    '<h2>GreenLine presente en la ExpoChina 2025</h2>
<p>Del miércoles 29 de octubre al sábado 1 de noviembre, participamos en la ExpoChina 2025, realizada en el Centro de Exposiciones Jockey, un evento de enfoque comercial que reunió a empresas de diversos sectores vinculados al intercambio y la cooperación entre China y el Perú.</p>
<p>Durante el evento, contamos con un stand donde exhibimos algunos de los vehículos que forman parte de nuestro catálogo. GreenLine es una marca peruana, con producción en colaboración directa con fabricantes de China, lo que nos permite ofrecer vehículos eléctricos con altos estándares de calidad, innovación y tecnología. Presentamos soluciones que abarcan vehículos de movilidad personal (VMP), motos, trimotos y cargueros eléctricos, pensados tanto para usuarios finales como para nuevos distribuidores interesados en ampliar su portafolio con alternativas sostenibles y competitivas, en un espacio que impulsó el comercio y la visibilidad de empresas nacionales e internacionales.</p>
<p>La feria reunió a marcas de distintos rubros, como movilidad eléctrica, maquinaria textil, tecnología, entre otros; generando un entorno propicio para el intercambio comercial y la creación de nuevas oportunidades de negocio. En este contexto, numerosos emprendedores mostraron especial interés en nuestros vehículos de carga, destacando su eficiencia, capacidad operativa y el ahorro que representan para actividades de distribución, reparto y servicios.</p>
<p>Nuestra participación en la ExpoChina 2025 fue una experiencia gratificante que nos permitió acercarnos a nuevos públicos, fortalecer vínculos comerciales y seguir posicionando la movilidad eléctrica como una solución real para los negocios. En GreenLine continuamos impulsando alternativas de transporte que acompañen el crecimiento de los emprendedores y contribuyan a un futuro más eficiente e innovador.</p>',
    'GreenLine presente en la ExpoChina 2025

Del miércoles 29 de octubre al sábado 1 de noviembre, participamos en la ExpoChina 2025, realizada en el Centro de Exposiciones Jockey, un evento de enfoque comercial que reunió a empresas de diversos sectores vinculados al intercambio y la cooperación entre China y el Perú.

Durante el evento, contamos con un stand donde exhibimos algunos de los vehículos que forman parte de nuestro catálogo. GreenLine es una marca peruana, con producción en colaboración directa con fabricantes de China, lo que nos permite ofrecer vehículos eléctricos con altos estándares de calidad, innovación y tecnología. Presentamos soluciones que abarcan vehículos de movilidad personal (VMP), motos, trimotos y cargueros eléctricos, pensados tanto para usuarios finales como para nuevos distribuidores interesados en ampliar su portafolio con alternativas sostenibles y competitivas, en un espacio que impulsó el comercio y la visibilidad de empresas nacionales e internacionales.

La feria reunió a marcas de distintos rubros, como movilidad eléctrica, maquinaria textil, tecnología, entre otros; generando un entorno propicio para el intercambio comercial y la creación de nuevas oportunidades de negocio. En este contexto, numerosos emprendedores mostraron especial interés en nuestros vehículos de carga, destacando su eficiencia, capacidad operativa y el ahorro que representan para actividades de distribución, reparto y servicios.

Nuestra participación en la ExpoChina 2025 fue una experiencia gratificante que nos permitió acercarnos a nuevos públicos, fortalecer vínculos comerciales y seguir posicionando la movilidad eléctrica como una solución real para los negocios. En GreenLine continuamos impulsando alternativas de transporte que acompañen el crecimiento de los emprendedores y contribuyan a un futuro más eficiente e innovador.',
    'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-1.webp',
    'GreenLine presente en la ExpoChina 2025',
    '2026-02-04',
    FALSE,
    TRUE,
    25
);

-- ============================================================
-- Actualizar image_url e image_alt de los 20 artículos existentes
-- ============================================================
UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-PORTADA.webp',
    image_alt = 'Ponencia de GreenLine en la UPN'
WHERE slug = 'ponencia-de-greenline-en-la-upn';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_upn/VMP.UPN-PORTADA.webp',
    image_alt = 'GreenLine y UPN impulsan una movilidad más sostenible'
WHERE slug = 'greenline-y-upn-impulsan-una-movilidad-mas-sostenible';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_bbva/BENEFICIO-BBVA-1.webp',
    image_alt = 'Tu próximo vehículo eléctrico, más cerca'
WHERE slug = 'tu-proximo-vehiculo-electrico-mas-cerca';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/integracion_2026/INTEGRACION-PORTADA.webp',
    image_alt = 'Integración GreenLine 2026'
WHERE slug = 'integracion-greenline-2026';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/jugamos_mismo_lado/JUGAMOS-DEL-MISMO-LADO-PORTADA.webp',
    image_alt = 'Un país que avanza en conjunto'
WHERE slug = 'un-pais-que-avanza-en-conjunto';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/lluvia_danar_moto/LA-LLUVIA-PUEDE_portada.webp',
    image_alt = '¿Resistencia a la lluvia?'
WHERE slug = 'resistencia-a-la-lluvia';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/portada-peru-sostenible.webp',
    image_alt = 'Cumbre Perú Sostenible'
WHERE slug = 'cumbre-peru-sostenible';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/impacto_real_co2/IMPACTO-AMBIENTAL-1.webp',
    image_alt = 'Impacto ambiental'
WHERE slug = 'impacto-ambiental';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/normalizado_vivir_trafico_ruido/CLIMA-1.webp',
    image_alt = 'Cuando el ruido y la contaminación se vuelven rutina'
WHERE slug = 'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_ate/GREENLINE-ATE-1.webp',
    image_alt = 'GreenLine llega a Ate'
WHERE slug = 'greenline-llega-a-ate';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/cargueros_negocios/PORTADA-CARGUERO.webp',
    image_alt = 'Logística que crece contigo'
WHERE slug = 'logistica-que-crece-contigo';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/mantenimiento_preventivo/MANTENIMIENTO-PREVENTIVO-1-scaled.webp',
    image_alt = 'Mantenimiento preventivo vs correctivo'
WHERE slug = 'mantenimiento-preventivo-vs-correctivo';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peso_vehiculo/POR-QUE-ES-IMPORTANTE.webp',
    image_alt = '¿Es importante respetar la capacidad de carga?'
WHERE slug = 'es-importante-respetar-la-capacidad-de-carga';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-1.webp',
    image_alt = '¿Cada cuánto debo cargar mi vehículo eléctrico?'
WHERE slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/pendientes_vehiculos/PENDIENTES-1.webp',
    image_alt = '¿Pueden subir pendientes?'
WHERE slug = 'pueden-subir-pendientes';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/costo_x_carga/COSTO-POR-CARGA-1.webp',
    image_alt = '¿Cuánto cuesta cargar un vehículo eléctrico?'
WHERE slug = 'cuanto-cuesta-cargar-un-vehiculo-electrico';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_bateria/BATERIA-GREENLINE-4.webp',
    image_alt = '¿Cuál es la mejor batería?'
WHERE slug = 'cual-es-la-mejor-bateria';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_freno/TIPOS-DE-FRENO-PORTADA.webp',
    image_alt = '¿Qué tipos de freno usamos?'
WHERE slug = 'que-tipos-de-freno-usamos';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/necesidad_autonomia/QUE-AUTONOMIA-NECESITO.webp',
    image_alt = '¿Cuánto de autonomía necesitas tu vehículo eléctrico?'
WHERE slug = 'cuanto-de-autonomia-necesita-tu-vehiculo-electrico';

UPDATE greenline_posts SET
    image_url = 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_duracion_bateria_mas/CUANTO-ME-DURA-MI-VEHICULO-ELECTRICO.webp',
    image_alt = '¿Cuánto dura un vehículo eléctrico?'
WHERE slug = 'cuanto-dura-un-vehiculo-electrico';

-- ============================================================
-- Insertar imágenes de galería para todos los artículos
-- ============================================================

-- 1. Ponencia de GreenLine en la UPN (9 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-PORTADA.webp', 'Ponencia de GreenLine en la UPN', 0
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-1.webp', 'Ponencia de GreenLine en la UPN', 1
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-2-scaled.webp', 'Ponencia de GreenLine en la UPN', 2
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-3-scaled.webp', 'Ponencia de GreenLine en la UPN', 3
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-4.webp', 'Ponencia de GreenLine en la UPN', 4
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-5.webp', 'Ponencia de GreenLine en la UPN', 5
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-6.webp', 'Ponencia de GreenLine en la UPN', 6
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-7.webp', 'Ponencia de GreenLine en la UPN', 7
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/ponencia_upn/PONENCIA-UPN-8.webp', 'Ponencia de GreenLine en la UPN', 8
FROM greenline_posts p WHERE p.slug = 'ponencia-de-greenline-en-la-upn';

-- 2. GreenLine y UPN impulsan una movilidad más sostenible (3 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_upn/VMP.UPN-PORTADA.webp', 'GreenLine y UPN impulsan una movilidad más sostenible', 0
FROM greenline_posts p WHERE p.slug = 'greenline-y-upn-impulsan-una-movilidad-mas-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_upn/VMP-UPN-4.webp', 'GreenLine y UPN impulsan una movilidad más sostenible', 1
FROM greenline_posts p WHERE p.slug = 'greenline-y-upn-impulsan-una-movilidad-mas-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_upn/VMP-UPN-scaled.webp', 'GreenLine y UPN impulsan una movilidad más sostenible', 2
FROM greenline_posts p WHERE p.slug = 'greenline-y-upn-impulsan-una-movilidad-mas-sostenible';

-- 3. Tu próximo vehículo eléctrico, más cerca (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_bbva/BENEFICIO-BBVA-1.webp', 'Tu próximo vehículo eléctrico, más cerca', 0
FROM greenline_posts p WHERE p.slug = 'tu-proximo-vehiculo-electrico-mas-cerca';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/beneficio_bbva/BENEFICIO-BBVA-2-scaled.webp', 'Tu próximo vehículo eléctrico, más cerca', 1
FROM greenline_posts p WHERE p.slug = 'tu-proximo-vehiculo-electrico-mas-cerca';

-- 4. Integración GreenLine 2026 (4 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/integracion_2026/INTEGRACION-PORTADA.webp', 'Integración GreenLine 2026', 0
FROM greenline_posts p WHERE p.slug = 'integracion-greenline-2026';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/integracion_2026/INTEGRACION-1.webp', 'Integración GreenLine 2026', 1
FROM greenline_posts p WHERE p.slug = 'integracion-greenline-2026';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/integracion_2026/INTEGRACION-2.webp', 'Integración GreenLine 2026', 2
FROM greenline_posts p WHERE p.slug = 'integracion-greenline-2026';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/integracion_2026/INTEGRACION-3.webp', 'Integración GreenLine 2026', 3
FROM greenline_posts p WHERE p.slug = 'integracion-greenline-2026';

-- 5. Un país que avanza en conjunto (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/jugamos_mismo_lado/JUGAMOS-DEL-MISMO-LADO-PORTADA.webp', 'Un país que avanza en conjunto', 0
FROM greenline_posts p WHERE p.slug = 'un-pais-que-avanza-en-conjunto';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/jugamos_mismo_lado/JUGAMOS-DEL-MISMO-LADO-1.webp', 'Un país que avanza en conjunto', 1
FROM greenline_posts p WHERE p.slug = 'un-pais-que-avanza-en-conjunto';

-- 6. ¿Resistencia a la lluvia? (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/lluvia_danar_moto/LA-LLUVIA-PUEDE_portada.webp', '¿Resistencia a la lluvia?', 0
FROM greenline_posts p WHERE p.slug = 'resistencia-a-la-lluvia';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/lluvia_danar_moto/LA-LLUVIA-PUEDE-2-scaled.webp', '¿Resistencia a la lluvia?', 1
FROM greenline_posts p WHERE p.slug = 'resistencia-a-la-lluvia';

-- 7. Cumbre Perú Sostenible (7 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/portada-peru-sostenible.webp', 'Cumbre Perú Sostenible', 0
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/Cubre-Peru-sostenible-3.webp', 'Cumbre Perú Sostenible', 1
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/Cubre-Peru-sostenible-4.webp', 'Cumbre Perú Sostenible', 2
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/Cubre-Peru-sostenible-5.webp', 'Cumbre Perú Sostenible', 3
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/Cubre-Peru-sostenible-equipo.webp', 'Cumbre Perú Sostenible', 4
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/Cumbre-Peru-sostenible-1.webp', 'Cumbre Perú Sostenible', 5
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peru_sostenible_2025/Cumbre-Peru-sostenible-2.webp', 'Cumbre Perú Sostenible', 6
FROM greenline_posts p WHERE p.slug = 'cumbre-peru-sostenible';

-- 8. Impacto ambiental (4 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/impacto_real_co2/IMPACTO-AMBIENTAL-1.webp', 'Impacto ambiental', 0
FROM greenline_posts p WHERE p.slug = 'impacto-ambiental';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/impacto_real_co2/UGGO-MANEJA-1-scaled.webp', 'Impacto ambiental', 1
FROM greenline_posts p WHERE p.slug = 'impacto-ambiental';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/impacto_real_co2/UGGO-MANEJA-2-scaled.webp', 'Impacto ambiental', 2
FROM greenline_posts p WHERE p.slug = 'impacto-ambiental';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/impacto_real_co2/UGGO-MEJORADO-1.png', 'Impacto ambiental', 3
FROM greenline_posts p WHERE p.slug = 'impacto-ambiental';

-- 9. Cuando el ruido y la contaminación se vuelven rutina (5 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/normalizado_vivir_trafico_ruido/CLIMA-1.webp', 'Cuando el ruido y la contaminación se vuelven rutina', 0
FROM greenline_posts p WHERE p.slug = 'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/normalizado_vivir_trafico_ruido/CLIMA-2.webp', 'Cuando el ruido y la contaminación se vuelven rutina', 1
FROM greenline_posts p WHERE p.slug = 'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/normalizado_vivir_trafico_ruido/CLIMA-3.webp', 'Cuando el ruido y la contaminación se vuelven rutina', 2
FROM greenline_posts p WHERE p.slug = 'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/normalizado_vivir_trafico_ruido/CLIMA-4.webp', 'Cuando el ruido y la contaminación se vuelven rutina', 3
FROM greenline_posts p WHERE p.slug = 'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/normalizado_vivir_trafico_ruido/CLIMA5.webp', 'Cuando el ruido y la contaminación se vuelven rutina', 4
FROM greenline_posts p WHERE p.slug = 'cuando-el-ruido-y-la-contaminacion-se-vuelven-rutina';

-- 10. GreenLine llega a Ate (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_ate/GREENLINE-ATE-1.webp', 'GreenLine llega a Ate', 0
FROM greenline_posts p WHERE p.slug = 'greenline-llega-a-ate';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_ate/GREENLINE-ATE-2.webp', 'GreenLine llega a Ate', 1
FROM greenline_posts p WHERE p.slug = 'greenline-llega-a-ate';

-- 11. Logística que crece contigo (5 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/cargueros_negocios/PORTADA-CARGUERO.webp', 'Logística que crece contigo', 0
FROM greenline_posts p WHERE p.slug = 'logistica-que-crece-contigo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/cargueros_negocios/CARGUERO-1.webp', 'Logística que crece contigo', 1
FROM greenline_posts p WHERE p.slug = 'logistica-que-crece-contigo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/cargueros_negocios/CARGUERO-2.webp', 'Logística que crece contigo', 2
FROM greenline_posts p WHERE p.slug = 'logistica-que-crece-contigo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/cargueros_negocios/CARGUERO-3.webp', 'Logística que crece contigo', 3
FROM greenline_posts p WHERE p.slug = 'logistica-que-crece-contigo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/cargueros_negocios/CARGUERO-4.webp', 'Logística que crece contigo', 4
FROM greenline_posts p WHERE p.slug = 'logistica-que-crece-contigo';

-- 12. Mantenimiento preventivo vs correctivo (3 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/mantenimiento_preventivo/MANTENIMIENTO-PREVENTIVO-1-scaled.webp', 'Mantenimiento preventivo vs correctivo', 0
FROM greenline_posts p WHERE p.slug = 'mantenimiento-preventivo-vs-correctivo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/mantenimiento_preventivo/MANTENIMIENTO-CORRECTIVO-2-scaled.webp', 'Mantenimiento preventivo vs correctivo', 1
FROM greenline_posts p WHERE p.slug = 'mantenimiento-preventivo-vs-correctivo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/mantenimiento_preventivo/MANTENIMIENTO-PREVENTIVO-3.webp', 'Mantenimiento preventivo vs correctivo', 2
FROM greenline_posts p WHERE p.slug = 'mantenimiento-preventivo-vs-correctivo';

-- 13. ¿Es importante respetar la capacidad de carga? (3 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peso_vehiculo/POR-QUE-ES-IMPORTANTE.webp', '¿Es importante respetar la capacidad de carga?', 0
FROM greenline_posts p WHERE p.slug = 'es-importante-respetar-la-capacidad-de-carga';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peso_vehiculo/POR-QUE-ES-TAN-IMPPRTANTE-2.webp', '¿Es importante respetar la capacidad de carga?', 1
FROM greenline_posts p WHERE p.slug = 'es-importante-respetar-la-capacidad-de-carga';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/peso_vehiculo/POR-QUE-ES-TAN-IMPORTANTE-3.webp', '¿Es importante respetar la capacidad de carga?', 2
FROM greenline_posts p WHERE p.slug = 'es-importante-respetar-la-capacidad-de-carga';

-- 14. ¿Cada cuánto debo cargar mi vehículo eléctrico? (7 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-1.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 0
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-2.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 1
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-3.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 2
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-4.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 3
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-5.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 4
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-6.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 5
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_carga_bateria/CADA-CUANTO-DEBO-CARGAR-MI-GREENLINE-7.webp', '¿Cada cuánto debo cargar mi vehículo eléctrico?', 6
FROM greenline_posts p WHERE p.slug = 'cada-cuanto-debo-cargar-mi-vehiculo-electrico';

-- 15. ¿Pueden subir pendientes? (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/pendientes_vehiculos/PENDIENTES-1.webp', '¿Pueden subir pendientes?', 0
FROM greenline_posts p WHERE p.slug = 'pueden-subir-pendientes';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/pendientes_vehiculos/PENDIENTES-2.webp', '¿Pueden subir pendientes?', 1
FROM greenline_posts p WHERE p.slug = 'pueden-subir-pendientes';

-- 16. ¿Cuánto cuesta cargar un vehículo eléctrico? (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/costo_x_carga/COSTO-POR-CARGA-1.webp', '¿Cuánto cuesta cargar un vehículo eléctrico?', 0
FROM greenline_posts p WHERE p.slug = 'cuanto-cuesta-cargar-un-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/costo_x_carga/COSTO-POR-CARGA-2.webp', '¿Cuánto cuesta cargar un vehículo eléctrico?', 1
FROM greenline_posts p WHERE p.slug = 'cuanto-cuesta-cargar-un-vehiculo-electrico';

-- 17. ¿Cuál es la mejor batería? (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_bateria/BATERIA-GREENLINE-4.webp', '¿Cuál es la mejor batería?', 0
FROM greenline_posts p WHERE p.slug = 'cual-es-la-mejor-bateria';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_bateria/BATERIA-GREENLINE-5.webp', '¿Cuál es la mejor batería?', 1
FROM greenline_posts p WHERE p.slug = 'cual-es-la-mejor-bateria';

-- 18. ¿Qué tipos de freno usamos? (4 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_freno/TIPOS-DE-FRENO-PORTADA.webp', '¿Qué tipos de freno usamos?', 0
FROM greenline_posts p WHERE p.slug = 'que-tipos-de-freno-usamos';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_freno/TIPOS-DE-FRENO-1.webp', '¿Qué tipos de freno usamos?', 1
FROM greenline_posts p WHERE p.slug = 'que-tipos-de-freno-usamos';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_freno/TIPOS-DE-FRENO-2.webp', '¿Qué tipos de freno usamos?', 2
FROM greenline_posts p WHERE p.slug = 'que-tipos-de-freno-usamos';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tipos_freno/TIPOS-DE-FRENO-3.webp', '¿Qué tipos de freno usamos?', 3
FROM greenline_posts p WHERE p.slug = 'que-tipos-de-freno-usamos';

-- 19. ¿Cuánto de autonomía necesitas tu vehículo eléctrico? (3 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/necesidad_autonomia/QUE-AUTONOMIA-NECESITO.webp', '¿Cuánto de autonomía necesitas tu vehículo eléctrico?', 0
FROM greenline_posts p WHERE p.slug = 'cuanto-de-autonomia-necesita-tu-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/necesidad_autonomia/QUE-AUTONOMIA-NECESITO-2-scaled.webp', '¿Cuánto de autonomía necesitas tu vehículo eléctrico?', 1
FROM greenline_posts p WHERE p.slug = 'cuanto-de-autonomia-necesita-tu-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/necesidad_autonomia/QUE-AUTONOMIA-NECESITO-3-scaled.webp', '¿Cuánto de autonomía necesitas tu vehículo eléctrico?', 2
FROM greenline_posts p WHERE p.slug = 'cuanto-de-autonomia-necesita-tu-vehiculo-electrico';

-- 20. ¿Cuánto dura un vehículo eléctrico? (3 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_duracion_bateria_mas/CUANTO-ME-DURA-MI-VEHICULO-ELECTRICO.webp', '¿Cuánto dura un vehículo eléctrico?', 0
FROM greenline_posts p WHERE p.slug = 'cuanto-dura-un-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_duracion_bateria_mas/CUANTO-DURA-UN-VEHGICULO-ELECTRICO.webp', '¿Cuánto dura un vehículo eléctrico?', 1
FROM greenline_posts p WHERE p.slug = 'cuanto-dura-un-vehiculo-electrico';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/tips_duracion_bateria_mas/¿MI-VEHICULO-ELECTRICO-PUEDE-DURARME-ANOS-WEBBBP.webp', '¿Cuánto dura un vehículo eléctrico?', 2
FROM greenline_posts p WHERE p.slug = 'cuanto-dura-un-vehiculo-electrico';

-- 21. Bienvenida de Ciclo UPN x GreenLine (9 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/PORTADA-INICIO-DE-CICLO-UPN.webp', 'Bienvenida de Ciclo UPN x GreenLine', 0
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/INICIO-DE-CICLO-1.webp', 'Bienvenida de Ciclo UPN x GreenLine', 1
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/INICIO-DE-CICLO-2-scaled.webp', 'Bienvenida de Ciclo UPN x GreenLine', 2
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/INICIO-DE-CICLO-3-scaled.webp', 'Bienvenida de Ciclo UPN x GreenLine', 3
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/INICIO-DE-CICLO-4-scaled.webp', 'Bienvenida de Ciclo UPN x GreenLine', 4
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/UPN-CICLO1.webp', 'Bienvenida de Ciclo UPN x GreenLine', 5
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/UPN-CICLO-2.webp', 'Bienvenida de Ciclo UPN x GreenLine', 6
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/UPN-CICLO-3.webp', 'Bienvenida de Ciclo UPN x GreenLine', 7
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/bienvenida_upn/UPN-CICLO-4.webp', 'Bienvenida de Ciclo UPN x GreenLine', 8
FROM greenline_posts p WHERE p.slug = 'bienvenida-de-ciclo-upn-x-grenline';

-- 22. Delivery Urbano (2 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/delivery_autonomia/PORTADA-DE-DELIVERY.webp', 'Delivery Urbano', 0
FROM greenline_posts p WHERE p.slug = 'delivery-urbano';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/delivery_autonomia/FOTO-PARA-DELIVERY-scaled.webp', 'Delivery Urbano', 1
FROM greenline_posts p WHERE p.slug = 'delivery-urbano';

-- 23. Nueva tienda GreenLine Comas (3 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_comas/COMAS-1.webp', 'Nueva tienda GreenLine Comas', 0
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-comas';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_comas/COMAS-2.webp', 'Nueva tienda GreenLine Comas', 1
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-comas';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_comas/WhatsApp-Image-2026-04-30-at-5.22.25-PM.webp', 'Nueva tienda GreenLine Comas', 2
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-comas';

-- 24. Nueva tienda GreenLine Huancayo (4 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_huancayo/PORTADA-GREEN-HUANCAYO.webp', 'Nueva tienda GreenLine Huancayo', 0
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-huancayo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_huancayo/CLIENTA-HUANCAYO.webp', 'Nueva tienda GreenLine Huancayo', 1
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-huancayo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_huancayo/TIENDA-HUANCAYO.webp', 'Nueva tienda GreenLine Huancayo', 2
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-huancayo';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/nueva_tienda_huancayo/VENDEDOR-HUANCAYO.webp', 'Nueva tienda GreenLine Huancayo', 3
FROM greenline_posts p WHERE p.slug = 'nueva-tienda-huancayo';

-- 25. GreenLine presente en la ExpoChina 2025 (7 imágenes)
INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-1.webp', 'GreenLine presente en la ExpoChina 2025', 0
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-2.webp', 'GreenLine presente en la ExpoChina 2025', 1
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-3.webp', 'GreenLine presente en la ExpoChina 2025', 2
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-4.webp', 'GreenLine presente en la ExpoChina 2025', 3
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-5.webp', 'GreenLine presente en la ExpoChina 2025', 4
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-6.webp', 'GreenLine presente en la ExpoChina 2025', 5
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

INSERT INTO greenline_post_images (post_id, image_url, image_alt, sort_order)
SELECT p.id, 'https://nxcbtcexsakfenjfdarr.supabase.co/storage/v1/object/public/Greenline_database/assets/imagenes/imagenes/articulos/expochina_2025/EXPOCHINA-7.webp', 'GreenLine presente en la ExpoChina 2025', 6
FROM greenline_posts p WHERE p.slug = 'expo-china-2025';

-- ============================================================
-- Vista pública simplificada para la API de React.
-- ============================================================
CREATE OR REPLACE VIEW greenline_posts_public AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.author,
    p.excerpt,
    p.content_html,
    p.content_text,
    p.image_url,
    p.image_alt,
    p.published_at,
    p.featured,
    p.active,
    p.sort_order,
    c.id AS category_id,
    c.name AS category,
    c.slug AS category_slug,
    COALESCE(
      (SELECT json_agg(json_build_object(
        'image_url', img.image_url,
        'image_alt', img.image_alt,
        'caption', img.caption,
        'sort_order', img.sort_order
      ) ORDER BY img.sort_order)
       FROM greenline_post_images img WHERE img.post_id = p.id),
      '[]'::json
    ) AS gallery_images
FROM greenline_posts p
JOIN greenline_categories c
    ON c.id = p.category_id
WHERE p.active = TRUE;

COMMIT;
