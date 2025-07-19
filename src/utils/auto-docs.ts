import { computed } from 'vue'
import { configProxy } from '@/config'

interface DocumentItem {
    slug: string
    pdf_path: string
}

interface DocumentMap {
    [key: string]: string | null
}

/** Получение переменных с автодоками **/
export function useAutoDocs(domain: string) {
    const domainConfig = configProxy[domain]
    const documents: DocumentItem[] = domainConfig?.documents || []

    const documentMap = computed<DocumentMap>(() => {
        return documents.reduce((acc, doc) => {
            acc[doc.slug] = doc.pdf_path
            return acc
        }, {} as DocumentMap)
    })

    const publicOfertaPdf = computed(() => documentMap.value.offerta || null)
    const personalDataPoliticPdf = computed(() => documentMap.value.politics_obrab || null)
    const personalDataAgreementPdf = computed(() => documentMap.value.sogl_obrab || null)
    const paidSubAgreementPdf = computed(() => documentMap.value.sogl_podpiska || null)
    const recurrPaymentsAgreementPdf = computed(() => documentMap.value.recurr_payments_agreement || null)
    const cardDataAgreementPdf = computed(() => documentMap.value.card_data_agreement || null)

    return {
        publicOfertaPdf,
        personalDataPoliticPdf,
        personalDataAgreementPdf,
        paidSubAgreementPdf,
        recurrPaymentsAgreementPdf,
        cardDataAgreementPdf,
    }
}
