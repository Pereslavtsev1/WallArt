<div className='space-y-3 py-6 px-2'>
  <section className='flex items-center justify-between'>
    <Link
      href={`/profile/${wallpaper.user.username}`}
      className='flex items-center gap-x-3'
    >
      <UserItem src={wallpaper.user.imageUrl} alt={wallpaper.title} />
      <div className='space-y-0.5'>
        <p className='text-muted-foreground font-semibold text-sm truncate'>
          {wallpaper.user.username}
        </p>
        <p className='text-xs font-semibold truncate'>{wallpaper.title}</p>
      </div>
    </Link>
    <div className='flex items-center gap-x-2'>
      <Button size='icon' variant='secondary' aria-label='Like wallpaper'>
        <Heart className='text-foreground' />
      </Button>
      <Button size='icon' variant='secondary' aria-label='Add to collection'>
        <PlusIcon className='text-foreground size-5' />
      </Button>
    </div>
  </section>
  <div className='space-y-6'>
    <section
      className='relative max-h-[66vh] mx-auto'
      style={{
        aspectRatio: `${wallpaper.width} / ${wallpaper.height}`,
      }}
    >
      <Image
        className='rounded-xl'
        src={buildImageUrl(wallpaper.fileKey)}
        alt={wallpaper.title}
        fill
        objectFit='cover'
      />
    </section>

    <section className='space-y-3'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground leading-tight'>
            {wallpaper.title}
          </h1>
          <p className='text-muted-foreground text-sm leading-relaxed font-semibold'>
            {wallpaper.description}
          </p>
        </div>
        <div className='space-x-2'>
          <DownloadButton
            fileKey={wallpaper.fileKey}
            fileName={wallpaper.title}
          />

          <Button variant='secondary' className='font-semibold'>
            <ForwardIcon />
            Share
          </Button>
        </div>
      </div>
      <div>
        <div className='flex gap-x-1 items-center text-muted-foreground'>
          <CalendarIcon className='size-3.5' />
          <p className='text-xs font-semibold'>
            Published on: {wallpaper.createdAt.toDateString()}
          </p>
        </div>
        <div className='text-muted-foreground flex gap-x-1 items-center'>
          <ScalingIcon className='size-3.5' />
          <p className='text-xs font-semibold'>
            Resolution: {wallpaper.width}x{wallpaper.height}
          </p>
        </div>
      </div>
    </section>

    {wallpaper.tags && wallpaper.tags.length > 0 && (
      <div className='space-y-3'>
        <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
          Tags
        </h3>
        <div className='flex flex-wrap gap-2'>
          {wallpaper.tags.map((tag) => (
            <Badge key={tag.tagId}>{tag.tag.name}</Badge>
          ))}
        </div>
      </div>
    )}
  </div>
</div>;
