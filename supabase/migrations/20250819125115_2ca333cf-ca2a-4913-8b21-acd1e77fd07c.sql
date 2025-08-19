-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('standard', 'gyno_expert');

-- Create wiki articles table
CREATE TABLE public.wiki_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  author_id UUID NOT NULL,
  author_type user_role NOT NULL DEFAULT 'standard',
  is_verified BOOLEAN DEFAULT false,
  verification_sources TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wiki edits table for tracking changes
CREATE TABLE public.wiki_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.wiki_articles(id) ON DELETE CASCADE,
  editor_id UUID NOT NULL,
  editor_type user_role NOT NULL DEFAULT 'standard',
  edit_summary TEXT,
  content_diff TEXT,
  supporting_links TEXT[],
  attachments TEXT[],
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expert verification table
CREATE TABLE public.expert_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  medical_license_number TEXT NOT NULL,
  specialization TEXT NOT NULL,
  institution TEXT,
  verification_documents TEXT[],
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wiki_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_verifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for wiki_articles
CREATE POLICY "Anyone can view published articles" 
ON public.wiki_articles 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create articles" 
ON public.wiki_articles 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles" 
ON public.wiki_articles 
FOR UPDATE 
USING (auth.uid() = author_id);

-- RLS policies for wiki_edits
CREATE POLICY "Anyone can view approved edits" 
ON public.wiki_edits 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Authenticated users can submit edits" 
ON public.wiki_edits 
FOR INSERT 
WITH CHECK (auth.uid() = editor_id);

CREATE POLICY "Editors can view their own edits" 
ON public.wiki_edits 
FOR SELECT 
USING (auth.uid() = editor_id);

-- RLS policies for expert_verifications
CREATE POLICY "Users can submit their own verification" 
ON public.expert_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own verification status" 
ON public.expert_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add user_role to profiles table
ALTER TABLE public.profiles ADD COLUMN user_role user_role DEFAULT 'standard';

-- Create trigger for updating timestamps
CREATE TRIGGER update_wiki_articles_updated_at
BEFORE UPDATE ON public.wiki_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample gynecological content
INSERT INTO public.wiki_articles (title, content, summary, category, tags, author_id, author_type, is_verified) VALUES
('Menstrual Cycle Overview', 'The menstrual cycle is a monthly series of changes a woman''s body goes through in preparation for the possibility of pregnancy. Each month, one of the ovaries releases an egg — a process called ovulation. At the same time, hormonal changes prepare the uterus for pregnancy. If ovulation takes place and the egg isn''t fertilized, the lining of the uterus sheds through the vagina. This is a menstrual period.

## Phases of the Menstrual Cycle

### Menstrual Phase (Days 1-5)
The menstrual phase begins on the first day of menstruation and lasts for about 3-7 days. During this time, the thick lining of the uterus (endometrium) is shed through the vagina if pregnancy has not occurred.

### Follicular Phase (Days 1-13)
This phase overlaps with the menstrual phase and begins on the first day of menstruation. The pituitary gland releases follicle-stimulating hormone (FSH), which stimulates the ovaries to produce around 5-20 follicles.

### Ovulation (Day 14)
Ovulation occurs when a mature egg is released from the ovary. This typically happens around day 14 of a 28-day cycle, but can vary between individuals.

### Luteal Phase (Days 15-28)
After ovulation, the empty follicle develops into the corpus luteum, which produces progesterone. If pregnancy doesn''t occur, progesterone levels drop, leading to menstruation.', 'A comprehensive overview of the menstrual cycle, its phases, and hormonal changes throughout the month.', 'reproductive_health', ARRAY['menstruation', 'hormones', 'ovulation', 'cycle'], '00000000-0000-0000-0000-000000000000', 'gyno_expert', true),

('Polycystic Ovary Syndrome (PCOS)', 'Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age. Women with PCOS may have infrequent or prolonged menstrual periods or excess male hormone (androgen) levels. The ovaries may develop numerous small collections of fluid (follicles) and fail to regularly release eggs.

## Symptoms of PCOS

### Irregular Periods
Women with PCOS often experience irregular menstrual periods, including:
- Infrequent periods (oligomenorrhea)
- Absent periods (amenorrhea)
- Heavy bleeding during periods

### Excess Androgen Levels
High levels of male hormones may result in:
- Excess facial and body hair (hirsutism)
- Severe acne
- Male-pattern baldness

### Polycystic Ovaries
Ovaries might be enlarged and contain follicles that surround the eggs, causing the ovaries to fail to function regularly.

## Treatment Options
Treatment for PCOS typically focuses on managing individual symptoms and may include lifestyle modifications, medications to regulate menstruation, fertility treatments, and treatments for hirsutism and acne.', 'Information about Polycystic Ovary Syndrome, its symptoms, causes, and treatment options.', 'conditions', ARRAY['PCOS', 'hormones', 'ovaries', 'fertility'], '00000000-0000-0000-0000-000000000000', 'gyno_expert', true),

('Contraception Methods', 'Contraception refers to methods or devices used to prevent pregnancy. There are many different types of contraception available, each with varying levels of effectiveness, side effects, and suitability for different individuals.

## Hormonal Methods

### Combined Oral Contraceptive Pill
The combined pill contains synthetic versions of the hormones estrogen and progesterone. When taken correctly, it is over 99% effective at preventing pregnancy.

### Progestin-Only Pill (Mini Pill)
Contains only progestin and is suitable for women who cannot take estrogen. Must be taken at the same time every day.

### Contraceptive Injection
A long-acting progestin injection given every 12 weeks. Highly effective but may cause irregular bleeding.

## Barrier Methods

### Condoms
Male and female condoms provide protection against both pregnancy and sexually transmitted infections (STIs).

### Diaphragm
A dome-shaped silicone cup that covers the cervix and is used with spermicide.

## Long-Acting Reversible Contraception (LARC)

### Intrauterine Device (IUD)
T-shaped devices inserted into the uterus. Available in hormonal and copper varieties.

### Contraceptive Implant
A small rod inserted under the skin of the upper arm that releases hormones for up to three years.', 'Comprehensive guide to different contraception methods, their effectiveness, and suitability.', 'contraception', ARRAY['birth_control', 'hormones', 'barrier_methods', 'IUD'], '00000000-0000-0000-0000-000000000000', 'gyno_expert', true),

('Pelvic Inflammatory Disease (PID)', 'Pelvic Inflammatory Disease (PID) is an infection of the female reproductive organs. It most often occurs when sexually transmitted bacteria spread from the vagina to the uterus, fallopian tubes, or ovaries.

## Causes
PID is usually caused by bacteria from sexually transmitted infections (STIs), most commonly:
- Chlamydia trachomatis
- Neisseria gonorrhoeae

## Symptoms
Many women with PID experience mild or no symptoms. When symptoms do occur, they may include:
- Pain in the lower abdomen and pelvis
- Heavy vaginal discharge with an unpleasant odor
- Irregular menstrual bleeding
- Pain during intercourse
- Fever and chills
- Painful or difficult urination

## Complications
If left untreated, PID can cause serious complications including:
- Infertility
- Ectopic pregnancy
- Chronic pelvic pain
- Tubo-ovarian abscess

## Treatment
PID is typically treated with antibiotics. Sexual partners should also be tested and treated to prevent reinfection.', 'Information about Pelvic Inflammatory Disease, its causes, symptoms, and treatment.', 'conditions', ARRAY['PID', 'STI', 'infection', 'antibiotics'], '00000000-0000-0000-0000-000000000000', 'gyno_expert', true),

('Endometriosis', 'Endometriosis is a disorder in which tissue similar to the tissue that normally lines the inside of the uterus (endometrium) grows outside the uterus. This misplaced tissue continues to act as it normally would — it thickens, breaks down, and bleeds with each menstrual cycle.

## Symptoms
Common signs and symptoms of endometriosis include:
- Painful periods (dysmenorrhea)
- Pain with intercourse
- Pain with bowel movements or urination
- Excessive bleeding
- Infertility
- Fatigue, diarrhea, constipation, bloating, or nausea

## Stages of Endometriosis
Endometriosis is classified into four stages:
1. **Stage I (Minimal)**: Few superficial implants
2. **Stage II (Mild)**: More implants, deeper lesions
3. **Stage III (Moderate)**: Many deep implants, small cysts on ovaries
4. **Stage IV (Severe)**: Many deep implants, large cysts, dense adhesions

## Treatment Options
Treatment for endometriosis may include:
- Pain medications
- Hormone therapy
- Conservative surgery
- Hysterectomy (in severe cases)

## Living with Endometriosis
Management strategies include regular exercise, stress reduction, and dietary modifications.', 'Comprehensive information about endometriosis, including symptoms, stages, and treatment options.', 'conditions', ARRAY['endometriosis', 'pain', 'fertility', 'surgery'], '00000000-0000-0000-0000-000000000000', 'gyno_expert', true);