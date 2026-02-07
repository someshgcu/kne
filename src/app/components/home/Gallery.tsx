import { galleryImages } from '../../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Camera } from 'lucide-react';

export function Gallery() {
  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4">
            <Camera className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">Campus Life</span>
          </div>
          <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Experience INCPUC
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            A glimpse into our vibrant campus, state-of-the-art facilities, and student activities
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow ${
                index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <ImageWithFallback
                src={`https://images.unsplash.com/photo-${
                  index === 0 ? '1532619187' : 
                  index === 1 ? '1523580494' : 
                  index === 2 ? '1517694712202' : 
                  index === 3 ? '1461896836934' :
                  index === 4 ? '1521587760476' : '1517048676732'
                }-58d5b64e95d?w=800&q=80`}
                alt={image.title}
                className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                  index === 0 ? 'h-full min-h-[400px]' : 'h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-primary-foreground">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
