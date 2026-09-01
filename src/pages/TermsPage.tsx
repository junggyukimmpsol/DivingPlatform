import React from 'react'

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">
        <section className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-parks-gold">Terms</p>
          <h1 className="mt-4 font-display text-4xl font-black text-white md:text-5xl">
            이용약관 및 환불정책
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Parks Local Diving 투어 예약, 결제, 취소 및 환불에 관한 기본 안내입니다.
          </p>
        </section>

        <div className="space-y-6">
          <section className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-2xl font-bold text-white">사업자 정보</h2>
            <dl className="mt-5 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              <div>
                <dt className="font-bold text-slate-500">상호명</dt>
                <dd className="mt-1">마린앤그린</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">대표자명</dt>
                <dd className="mt-1">박준혁</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">사업자등록번호</dt>
                <dd className="mt-1">192-15-02825</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">업태</dt>
                <dd className="mt-1">서비스업</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">전화번호</dt>
                <dd className="mt-1">
                  <a href="tel:01057941330" className="text-parks-gold hover:text-white">
                    010-5794-1330
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-bold text-slate-500">주소</dt>
                <dd className="mt-1">경기도 화성시 동탄중심상가2길 8, 4층 401-파28호(반송동, 로하스애비뉴)</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">개업일</dt>
                <dd className="mt-1">2026년 01월 21일</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-500">등록일</dt>
                <dd className="mt-1">2026년 01월 22일</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-parks-gold/20 bg-parks-gold/10 p-6">
            <h2 className="font-display text-2xl font-bold text-white">안심 예약 증빙</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Parks Local Diving은 관광사업등록 및 여행업 보증보험 가입 내역을 기준으로 예약을 관리합니다.
              증빙 원본은 민감정보를 제외한 범위에서 요청 시 확인할 수 있습니다.
            </p>
            <dl className="mt-5 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <dt className="font-bold text-parks-gold">관광사업등록</dt>
                <dd className="mt-2 leading-7">화성시 관광사업등록증 제2026-000002호</dd>
                <dd className="mt-1 text-slate-400">업종: 국내외여행업</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <dt className="font-bold text-parks-gold">여행업 보증보험</dt>
                <dd className="mt-2 leading-7">SGI서울보증 다이렉트인허가보증보험 가입</dd>
                <dd className="mt-1 text-slate-400">보증내용: 여행업자 영업보증금 보증</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <dt className="font-bold text-parks-gold">보험가입금액</dt>
                <dd className="mt-2 leading-7">30,000,000원</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <dt className="font-bold text-parks-gold">보험기간</dt>
                <dd className="mt-2 leading-7">2026년 01월 22일 ~ 2027년 01월 21일</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-2xl font-bold text-white">이용약관</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                본 약관은 마린앤그린이 운영하는 Parks Local Diving 웹사이트에서 제공하는
                다이빙 투어 예약, 회원 서비스, 결제 및 관련 서비스 이용에 적용됩니다.
              </p>
              <p>
                이용자는 예약 신청 및 결제 전에 상품 내용, 포함사항, 불포함사항, 안전 안내,
                환불정책을 확인해야 합니다. 다이빙 투어는 현지 해양 상황, 기상, 안전 판단에 따라
                일정이 변경되거나 취소될 수 있습니다.
              </p>
              <p>
                투어 예약 결제금액은 원화(KRW) 기준으로 표시 및 결제되며, 기존 외화 기준 가격은
                1 USD = 1,550원으로 환산하여 적용합니다.
              </p>
              <p>
                회원이 입력한 자격증 사진, 키, 몸무게, 발사이즈 등은 투어 예약, 장비 준비,
                안전 관리 목적 범위 내에서 사용됩니다.
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-2xl font-bold text-white">환불정책</h2>
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-white/10 text-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">취소 요청 시점</th>
                    <th className="px-4 py-3 font-bold">환불 기준</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-4 py-3">투어 7일 전 취소</td>
                    <td className="px-4 py-3">100% 환불</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">투어 5일 전 취소</td>
                    <td className="px-4 py-3">50% 환불</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">투어 3일 전 취소</td>
                    <td className="px-4 py-3">0% 환불</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              현지 기상 악화, 해양 상황, 업체 사유로 투어 진행이 불가능한 경우에는 일정 변경 또는
              환불을 안내합니다. 환불은 실제 원화 결제금액 기준으로 처리됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
