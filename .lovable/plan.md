

## Menu Page Updates

### Changes to `src/pages/Menu.tsx`

#### 1. Generate a new hero image using AI
Use the Lovable AI image generation (google/gemini-2.5-flash-image) via an edge function to generate a casual Mexican meal photo with ocean in the background -- a linear/horizontal composition showing a spread of colorful Mexican dishes on an outdoor table with ocean view. Store the generated image in Supabase storage and use it as the hero.

**However**, since AI-generated food photography may not match the quality expected, a simpler approach: use one of the existing food/chef assets that feels more casual and Mexican. Looking at available assets: `chef-ceviche.jpg`, `chef-mole.jpeg`, or `chef-margarita-sunset.png` could work. But the user specifically said "you can create it" and wants ocean behind it, so I'll generate it.

**Practical approach**: Create an edge function that generates the image, stores it in a storage bucket, and returns the URL. Then use that URL in the hero. But this adds complexity for a single static image. 

**Simplest path**: Generate the image via edge function, save to storage, and reference it. But actually, let me reconsider -- we can generate it once and save it as a static asset. The edge function approach is overkill for a one-time image.

**Best approach**: Use an edge function to generate the image, store it in Supabase storage bucket, and reference the public URL from the Menu page. This way it's a real image that persists.

#### 2. Change hero title from "Gourmet Dining" to something more appropriate
Since it covers all meals of the day, change to something like "Our Kitchen" or "Daily Menu" -- more casual, less "gourmet."

#### 3. Move breakfast footnotes to top of breakfast section
Move the `*Fruit & yogurt bowls included` and `*Orange juice & coffee included` notes to appear **before** the first menu item (Chilaquiles), styled like a restaurant does it -- italic, at the top of the section.

#### 4. Pizza Night as a full-width banner below the menu card
Remove from inside the Desserts column. Place it as a standalone banner section below the menu card, spanning full width with a subtle background treatment.

### Files Changed

1. **`src/pages/Menu.tsx`** -- All four changes above:
   - Update hero image source (use generated image from storage or a new local asset)
   - Change hero title/copy to be less "gourmet"
   - Move `footnotes` rendering to **before** the items list in the Breakfast category
   - Extract Pizza Night from the Desserts column grid and render it as a full-width banner below the menu card
   - Remove the downward zoom animation (no zoom)

2. **`supabase/functions/generate-menu-hero/index.ts`** -- New edge function to generate the hero image using Lovable AI and store it in a Supabase storage bucket

3. **Storage bucket** -- Create a `menu-assets` bucket via migration for storing the generated image

### Implementation Details

**Hero image generation**: The edge function will call the Lovable AI gateway with a prompt for a casual Mexican food spread photographed from a linear/straight-on angle with Pacific ocean visible behind, natural lighting, outdoor terrace setting. The result gets stored in a `menu-assets` public storage bucket. The Menu page will reference this public URL with a fallback to an existing food asset.

**Footnotes placement**: Move rendering of footnotes from after the items list to before it, styled as an italic note block at the top of the Breakfast section (below the category header, above the first item).

**Pizza Night banner**: Full-width section between the menu card and the CTA section. Styled as a horizontal banner with ornamental lines, not boxed inside a column.

