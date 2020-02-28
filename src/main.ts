import Album from './models/album';
import User from './models/user';
import Photo from './models/photo';

async function run() {

  // Tests :

  const albumFindById = await Album.findById(1, ['user', 'photos']);
  console.log(albumFindById);

  const albumFind = await Album.find();
  console.log(albumFind);

  const photo1 = new Photo(
    {
      albumId: 1,
      id: 7777777,
      title: 'test',
      url: 'test',
      thumbnailUrl: 'test',
    },
  );
  const photoCreate = await Photo.create(photo1);
  console.log(photoCreate);

  const photoDelete = await Photo.deleteById(5001);
  console.log(photoDelete);

  // debugger;
}

run().catch((err) => {
  console.error(err);
});
