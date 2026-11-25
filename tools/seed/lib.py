import json,os,re
os.makedirs('content/cms/articles',exist_ok=True)
n=[0]
def A(slug,title,hub,excerpt,body):
    n[0]+=1
    day=24-(n[0]//3)
    m=11 if day>0 else 10
    day=day if day>0 else 28+day
    plain=re.sub(r'<[^>]+>',' ',body)
    json.dump(dict(title=title,slug=slug,hub=hub,excerpt=excerpt,seoTitle=title[:60],seoDescription=excerpt[:155],
      publishedAt=f"2026-{m:02d}-{day:02d}T08:00:00+07:00",htmlContent=body),open(f'content/cms/articles/{slug}.json','w'),ensure_ascii=False,indent=2)
    print(slug,len(plain.split()))
